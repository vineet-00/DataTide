import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/types/workflow"
import { getAppUrl } from "@/lib/helper/appUrl"

export async function GET (req: Request) {
  const now = new Date()
  const workflows = await prisma.workflow.findMany({
    select: {id: true},
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: {not: null},
      nextRunAt: {lte: now},
    },
  })

  // console.log("@@WORKFLOWS TO RUN", workflows.length);
  for (const workflow of workflows) {
    await triggerWorkflow(workflow.id)
  }

  return Response.json({workflowsToRun: workflows.length}, {status: 200})
}

async function triggerWorkflow (workflowId: string) {
  const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`)
  // console.log("@@TRIGGER URL", triggerApiUrl);

  fetch(triggerApiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`,
      }, 
      cache: "no-store",
      // signal: AbortSignal.timeout(5000),
  }).catch((err) => console.error("Error triggering workflow with id", workflowId, ":error->", err.message))
}