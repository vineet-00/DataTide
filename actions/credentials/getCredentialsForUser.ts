"use server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function GetCredentialsForUser () {
  const {userId} = auth()
  if (!userId) {
    throw  new Error("Unathenticated")
  };

  return await prisma.credential.findMany({
    where: {userId},
    orderBy: {
      name: "asc",
    },
  })
}