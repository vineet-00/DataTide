"use client"
import { Dialog, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { TriangleAlertIcon, CalendarIcon, ClockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import CustomDialogHeader from "@/components/CustomDialogHeader"
import { useMutation } from "@tanstack/react-query"
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron"
import { RemoveWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import cronstrue from "cronstrue"
import { CronExpressionParser } from 'cron-parser';

export const SchedulerDialog = (props: {cron:string | null; workflowId: string}) => {
  
  const [cron, setCron] = useState(props.cron || "")
  const [validCron, setValidCron] = useState(false)
  const [readableCron, setReadableCron] = useState("")

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully", {id: "cron"})
    },
    onError: () => {
      toast.error("Something went wrong", {id: "cron"})
    },
  })

  const removeScheduleMutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success("Schedule updated successfully", {id: "cron"})
    },
    onError: () => {
      toast.error("Something went wrong", {id: "cron"})
    },
  })

  useEffect(() => {
    if(!cron) {
      setValidCron(false)
      setReadableCron("")
      return
    }
    try {
      CronExpressionParser.parse(cron)
      const humanCronStr = cronstrue.toString(cron)
      setValidCron(true)
      setReadableCron(humanCronStr)
    } catch(e) {
      console.log(e);
      setValidCron(false)
      setReadableCron("")
    }
  }, [cron])

  const workflowHasValidCron = props.cron && props.cron.length > 0
  const readableSavedCron = workflowHasValidCron && cronstrue.toString(props.cron!)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} size={"sm"} className={cn("text-sm p-0 h-auto text-orange-500", workflowHasValidCron && "text-emerald-800")}>
          {workflowHasValidCron && ( 
              <div className="flex items-center gap-2">
                <ClockIcon />
                {readableSavedCron}
              </div>
            )
          }
          {
            !workflowHasValidCron && (
              <div className="flex items-center gap-1">
                <TriangleAlertIcon className="h-3 w-3 " /> Set Schedule
              </div>
            )
          }
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader title="Schedule workflow execution" icon={CalendarIcon} />
        <div className="p-6 space-y-4">
          <DialogDescription className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution. All times are in UTC.
          </DialogDescription>
          <Input placeholder="E.g. * * * * *" value={cron} onChange={
            (e) => setCron(e.target.value)
          } />
          <div className={
            cn(
              "bg-accent rounded-md p-4 border text-sm shadow-sm border-destructive text-destructive border-2", 
              validCron && "border-emerald-600 border-2 text-emerald-800 bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-100")}>
            {validCron ? readableCron : "Not a valid cron expression"}
          </div>
          {
            workflowHasValidCron && (
              <DialogClose asChild>
                <div className="">
                  <Button 
                    className="w-full text-destructive border-destructive hover:text-destructive" 
                    variant={"outline"} 
                    disabled={
                      mutation.isPending || removeScheduleMutation.isPending
                    }
                    onClick={
                      () => {
                        toast.loading("Removing schedule...", {id: "cron"})
                        removeScheduleMutation.mutate(props.workflowId)
                      }
                    }
                  >Remove current Schedule</Button>
                  <Separator className="my-4" />
                </div>
              </DialogClose>
            )
          }
        </div>
        <DialogFooter className="px-6">
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button 
              className="w-full" 
              disabled={mutation.isPending || !validCron}
              onClick={
                () => {
                  toast.loading("Saving...", {id: "cron"})
                  mutation.mutate({
                    id: props.workflowId,
                    cron,
                  })
                }
              } 
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SchedulerDialog