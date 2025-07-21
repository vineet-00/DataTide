-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN "lastRunAt" DATETIME;
ALTER TABLE "Workflow" ADD COLUMN "lastRunId" DATETIME;
ALTER TABLE "Workflow" ADD COLUMN "lastRunStatus" TEXT;
