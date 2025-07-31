"use server"
import { createCredentialSchemaType, createCredentialSchema } from "@/schema/credential"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { symmetricEncrypt } from "@/lib/encryption"

export async function CreateCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form)
  if (!success) {
    throw new Error("invalid form data")
  };

  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  };

  const encryptedValue = symmetricEncrypt(data.value)

  // console.log("@TEST", { plain: data.value, encrypted: encryptedValue });

  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  })

  if (!result) {
    throw new Error("failed to create credential")
  };

  revalidatePath("/credentials")
}
