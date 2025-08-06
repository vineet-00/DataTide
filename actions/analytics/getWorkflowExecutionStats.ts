"use server"
import { Period } from "@/types/analytics"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { PeriodToDateRange } from "@/lib/helper/dates"
import { eachDayOfInterval, format } from "date-fns"
import { WorkflowExecutionStatus } from "@/types/workflow"

type Stats = Record<string, {
    success: number;
    failed: number;
  }>

export async function GetWorkflowExecutionStats (period: Period) {
  
  const {userId} = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  };

  const dateRange = PeriodToDateRange(period)
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
  })

  const dateFormat = "yyyy-MM-dd"

  const stats: Stats = eachDayOfInterval({start: dateRange.startDate, end: dateRange.endDate,})
  .map((date) => format(date, dateFormat))
  .reduce((acc, date) => {
    acc[date] = {
      success: 0,
      failed: 0,
    }
    return acc
  }, {} as any)

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat)
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success += 1
    };
     if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed += 1
    };
  })

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }))

  return result
}