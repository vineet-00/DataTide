import "server-only"
import prisma from "@/lib/prisma"
import { WorkflowExecutionStatus, ExecutionPhaseStatus } from "@/types/workflow"
import { waitFor } from "@/lib/helper/dal"
import { ExecutionPhase } from "@prisma/client"
import { AppNode } from "@/types/appNode"
import { TaskRegistry } from "@/lib/workflow/task/registry"
import { ExecutorRegistry } from "@/lib/workflow/executor/registry"

export async function ExecuteWorkflow (executionId: string) {
  const execution = await prisma.WorkflowExecution.findUnique({
    where: {id: executionId},
    include: {workflow: true, phases: true}, 
  })

  if (!execution) {
    throw new Error("execution not found")
  };

  const environment = {phases: {}}

  await initializeWorkflowExecution( executionId, execution.workflowId)
    await initializePhaseStatuses(execution)

    let creditsConsumed= 0
    let executionFailed = false
    for (const phase of execution.phases) {
      //
      const phaseExecution = await executeWorkflowPhase(phase)
      if (!phaseExecution.success) {
        executionFailed= true
        break
      };
    }

    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed)
  }


async function initializeWorkflowExecution (executionId: string, workflowId: string) {
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


async function executeWorkflowPhase (phase: ExecutionPhase) {
  const startedAt = new Date()
  const node = JSON.parse(phase.node) as AppNode

  // Update the phase status
  await prisma.ExecutionPhase.update({
    where: {id: phase.id},
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  })

  const creditsRequired = TaskRegistry[node.data.type].credits
  console.log(`Execution phase ${phase.name} with ${creditsRequired} credits required`);

  const success = await executePhase(phase, node)

  await finalizePhase(phase.id, success)
  return {success}
}

async function finalizePhase (phaseId: string, success: boolean) {
  const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED

  await prisma.ExecutionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  })
}


async function executePhase (phase: ExecutionPhase, node: AppNode): promise<boolean>{
  const runFn = ExecutorRegistry[node.data.type]
  if (!runFn) return false;

  return await runFn()
}