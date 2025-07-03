import React from "react"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import Editor from "@/app/workflow/_components/Editor"


export const Page = async ({params}: {params: {workflowId: string}}) => {
  const {workflowId} = params
  const {userId} = auth()

  if (!userId) {
    <div>unauthenticated</div>
  };

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  })

  if (!workflow) {
    return <div>Workflow not found</div>
  };

  return (
    <Editor workflow={workflow} />
  )
}

export default Page