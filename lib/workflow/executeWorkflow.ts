import "server-only"
import prisma from "@/lib/prisma"
import { WorkflowExecutionStatus, ExecutionPhaseStatus } from "@/types/workflow"
import { waitFor } from "@/lib/helper/dal"
import { ExecutionPhase } from "@prisma/client"
import { AppNode } from "@/types/appNode"
import { TaskRegistry } from "@/lib/workflow/task/registry"
import { ExecutorRegistry } from "@/lib/workflow/executor/registry"
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TaskParamType } from "@/types/task"
import { Browser, Page } from "puppeteer"
import { revalidatePath } from 'next/cache'
import { Edge } from "@xyflow/react"
import { createLogCollector } from "@/lib/log"

export async function ExecuteWorkflow (executionId: string, nextRunAt?: Date) {
  const execution = await prisma.WorkflowExecution.findUnique({
    where: {id: executionId},
    include: {workflow: true, phases: true}, 
  })

  if (!execution) {
    throw new Error("execution not found")
  };

  const edges = JSON.parse(execution.workflow.definition).edges as Edge[]

  const environment: Environment = {phases: {}}

  await initializeWorkflowExecution( executionId, execution.workflowId, nextRunAt)
  await initializePhaseStatuses(execution)

  let creditsConsumed= 0
  let executionFailed = false
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId)
    creditsConsumed += phaseExecution.creditsConsumed
    if (!phaseExecution.success) {
      executionFailed= true
      break
    };
  }

  await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed)

  await cleanupEnvironment(environment)
  revalidatePath("/workflows/runs")
}


async function initializeWorkflowExecution (executionId: string, workflowId: string, nextRunAt?: Date) {
  await prisma.WorkflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    }
  })

  await prisma.Workflow.update({
    where: {
      id: workflowId,
    },
    data:{
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
      ...(nextRunAt && {nextRunAt}),
    },
  })
}

async function initializePhaseStatuses (execution: any) {
  await prisma.ExecutionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  })
}

async function finalizeWorkflowExecution (
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED

  await prisma.WorkflowExecution.update({
    where: {id: executionId},
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    }
  })

  await prisma.Workflow.update({
    where: {
      id: workflowId,
      lastRunId: executionId,
    },
    data: {
      lastRunStatus: finalStatus
    },
  }).catch((err) => {
    // ignore, This mean that we have triggered other runs for this workflow while an execution was running 
  })
}


async function executeWorkflowPhase (phase: ExecutionPhase, environment: Environment, edges: Edge[], userId: string) {
  const logCollector = createLogCollector()
  const startedAt = new Date()
  const node = JSON.parse(phase.node) as AppNode

  setupEnvironmentForPhase(node, environment, edges)

  // Update the phase status
  await prisma.ExecutionPhase.update({
    where: {id: phase.id},
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs)
    },
  })

  const creditsRequired = TaskRegistry[node.data.type].credits
  
  let success = await decrementCredits(userId, creditsRequired, logCollector)
  const creditsConsumed = success ? creditsRequired : 0
  if (success) {
    success = await executePhase(phase, node, environment, logCollector)
  };
  const outputs = environment.phases[node.id].outputs

  await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed)
  return {success, creditsConsumed}
}

async function finalizePhase (phaseId: string, success: boolean, outputs: any, logCollector: LogCollector, creditsConsumed: number) {
  const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED

  await prisma.ExecutionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level,
          })),
        },
      },
    },
  })
}


async function executePhase (phase: ExecutionPhase, node: AppNode, environment: Environment, logCollector: LogCollector): Promise<boolean>{
  const runFn = ExecutorRegistry[node.data.type]
  if (!runFn) {
    logCollector.error(`not found executor for ${node.data.type}`)
    return false;
  }

  // await waitFor(3000)
  const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector)

  return await runFn(executionEnvironment)
}


function setupEnvironmentForPhase (node: AppNode, environment: Environment, edges: Edge[]) {
  environment.phases[node.id] = {inputs: {}, outputs: {}}
  const inputs = TaskRegistry[node.data.type].inputs
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name]
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue
      continue;
    };

    // if inputValue is present that means it's connected to outputs
    // Get input value from the outputs in the environment
    const connectedEdge = edges.find((edge) => edge.target === node.id && edge.targetHandle === input.name)
    if (!connectedEdge) {
      console.error("Missing edge for input", input.name, "node id", node.id)
      continue
    };

    const outputValue = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!]

    environment.phases[node.id].inputs[input.name] = outputValue
  }
}

function createExecutionEnvironment (node: AppNode, environment: Environment, logCollector: LogCollector): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value
    },

    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),

    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),

    log: logCollector,
  }
}

async function cleanupEnvironment (environment: Environment) {
  if (environment.browser) {
    await environment.browser.close().catch((e) => console.error("cannot close browser, reason: ", e))
  };
}

async function decrementCredits (userId: string, amount: number, logCollector: LogCollector) {
    try {
      await prisma.userBalance.update({
        where: {userId, credits:{gte: amount}},
        data: {
          credits: {decrement : amount},
        },
      })
      return true
    } catch(e) {
      // console.log(e);
      logCollector.error("insufficient balance")
      return false
    }
}