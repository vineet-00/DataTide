"use client"

import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger
 } from "@/components/ui/alert-dialog"
 import { Input } from "@/components/ui/input"
 import { Button } from "@/components/ui/button"
 import { useState } from "react"
 import { useMutation } from "@tanstack/react-query"
 import { DeleteCredential } from "@/actions/credentials/deleteCredential"
 import { toast } from "sonner"
 import { XIcon } from "lucide-react"

 interface Props{
  name: string;
 }

 export const DeleteCredentialDialog = ({name}: Props) => {
    const [open, setOpen] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const deleteMutation= useMutation({
      mutationFn: DeleteCredential,
      onSuccess: () => {
        toast.success("Credential deleted successfully", {id: name})
        setConfirmText("")
      },
      onError: () => {
        toast.error("Something went wrong", {id: name})
      },
    })

   return (
     <AlertDialog open={open} onOpenChange={setOpen}>
       <AlertDialogTrigger asChild>
         <Button variant={"destructive"} size={"icon"}>
           <XIcon size={18} />
         </Button>
       </AlertDialogTrigger>
       <AlertDialogContent>
         <AlertDialogHeader>
           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
           <AlertDialogDescription asChild>
            <div>
              <p>If you delete this credential, you will not be able to recover it.</p>
              <div className="flex flex-col py-4 gap-2">
                <p>If you are sure, enter <b>{name}</b> to confirm:</p>
                <Input 
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                /> 
              </div>
            </div>
           </AlertDialogDescription>

         </AlertDialogHeader>
         <AlertDialogFooter>
           <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
           <AlertDialogAction 
            disabled={confirmText !== name || deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick = {(e) => {
              // e.stopPropagation()
              toast.loading("Deleting credential...", {id: name})
              deleteMutation.mutate(name)
            }}
           >Delete</AlertDialogAction>
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
   )
 }

 export default DeleteCredentialDialog
 