"use client"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { UnPublishWorkflow } from "@/actions/workflows/unPublishWorkflow"
import { toast } from "sonner"

export const UnPublishBtn = ({workflowId}: {workflowId: string}) => {
  
  const mutation = useMutation({
    mutationFn: UnPublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", {id: workflowId})
    },
    onError: () => {
      toast.error("Something went wrong", {id: workflowId})
    },
  })

  return (
    <Button 
      variant={"outline"} 
      className="flex items-center gap-2" 
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Unpublishing workflow...", {id: workflowId})
        mutation.mutate(workflowId)
      }} >
        <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  )
}

export default UnPublishBtn