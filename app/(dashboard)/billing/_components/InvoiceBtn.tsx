"use client"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { DownloadInvoice } from "@/actions/billing/downloadInvoice"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"

export const InvoiceBtn = ({id}: {id: string}) => {
  
  const mutation = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => (window.location.href = data as string),
    onError: () => {
      toast.error("Somthing went wrong")
    },
  })

  return (
    <Button 
      variant={"ghost"} 
      size={"sm"} 
      className="text-xs gap-2 text-muted-foreground px-1"
      disabled={mutation.isPending}
      onClick={
        () => mutation.mutate(id)
      }
    >
      Invoice
      {mutation.isPending && (
        <Loader2Icon className="h-4 w-4 animate-spin" />
      )}
    </Button>
  )
}

export default InvoiceBtn