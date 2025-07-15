"use server"

import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow"
import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/types/workflow"
import { redirect } from "next/navigation"
import { AppNode } from "@/types/appNode"
import { Edge } from "@xyflow/react"
import { CreateFlowNode } from "@/lib/workflow/createFlowNode"
import { TaskType } from "@/types/task"

export async function CreateWorkflow (form: createWorkflowSchemaType ) {
  const {success, data} = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("invalid form data")
  };

  const {userId} = auth()
  if (!userId) {
    throw new Error("Unaunthanticated")
  };

  const initialFlow: {nodes: AppNode[], edges: Edge[]} = {
    nodes: [],
    edges: [],
  }

  // the flow entry point
  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

  const result = await prisma.workflow.create({
    data:{
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  })

  if (!result) {
    throw new Error("failed to create workflow")
  };

  redirect(`/workflow/editor/${result.id}`)
}