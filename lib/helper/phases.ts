import { ExecutionPhase } from "@prisma/client"

type Phase = Picl<ExecutionPhase, "creditsConsumed">

export function GetPhasesTotalCost (phases: Phase[]) {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0)
}