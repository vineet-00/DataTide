import { z } from "zod"

export const createCredentialSchema = z.object({
  name: z.string().min(1, "Name is required").max(30),
  value: z.string().max(500),
})

export type createCredentialSchemaType = z.infer<typeof createCredentialSchema>;