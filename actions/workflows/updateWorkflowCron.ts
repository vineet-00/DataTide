"use server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { CronExpressionParser } from 'cron-parser';
import { revalidatePath } from "next/cache"

export async function UpdateWorkflowCron ({id, cron} : {id: string; cron: string;}) {
  const {userId} = auth()
  if (!userId) {
    throw new Error("Unaunthenticated")
  };

  try {
    const interval = CronExpressionParser.parse(cron, {utc:true})
    await prisma.workflow.update({
    where:{id, userId},
    data: {
      cron,
      nextRunAt: interval.next().toDate(),
    },
  })
  } catch(e: any) {
    console.error("invalid cron:", e.message)
    throw new Error("invalid cron expression")
  }

  revalidatePath("/workflows")
}