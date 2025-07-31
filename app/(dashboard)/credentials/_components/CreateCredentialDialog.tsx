"use client"

import React, { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldEllipsis, Loader2 } from "lucide-react"
import CustomDialogHeader from "@/components/CustomDialogHeader"
import { useForm } from "react-hook-form"
import { createCredentialSchema, createCredentialSchemaType } from "@/schema/credential"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateCredential } from "@/actions/credentials/createCredential"
import { 
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
  import { Textarea } from "@/components/ui/textarea"
  import { useMutation } from "@tanstack/react-query"
  import { CreateWorkflow } from "@/actions/workflows/createWorkflow"
  import { toast } from "sonner"

export const CreateCredentialDialog = ({triggerText} : {
  triggerText? : string;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<createCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: {
      name: "",
      value: "",
    }
  })

  const {mutate, isPending} = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success("Credential created", {id: "create-credential"});
      setOpen(false)
      form.reset()
    },
    onError: () => {
      toast.error("Failed to create credential", {id: "create-credential"});
    },
  });

  const onSubmit = useCallback((
      values: createCredentialSchemaType
    ) => {
    toast.loading("Creating credential...", {id: "create-credential"});
    mutate(values);
  }, [mutate])

  return <Dialog open={open} onOpenChange={(open) => {
    form.reset();
    setOpen(open);
  }}>
    <DialogTrigger asChild>
      <Button>{triggerText ?? "Create"}</Button>
    </DialogTrigger>
    <DialogContent className="px-0">
      <CustomDialogHeader 
        icon={ShieldEllipsis}
        title="Create credential"
      />
      <div className="p-6">
        <Form {...form} >
          <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    Name
                    <p className="text-xs text-primary">(required)</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a unique and descriptive name for the credential<br/> This name will be identity the credential
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                )}
            />

            <FormField 
              control={form.control}
              name="value"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    Value
                    <p className="text-xs text-primary">(required)</p>
                  </FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the value associated with this credential <br/> This value will be securely encrypted and stored 
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {!isPending && "Proceed"}
              {isPending && <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  </Dialog>
}

export default CreateCredentialDialog