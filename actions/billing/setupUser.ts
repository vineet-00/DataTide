"use server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function SetupUser () {
  const {userId} = auth()
  if (!userId) {
    throw new Error("unathenticated")
  };

  const balance = await prisma.userBalance.findUnique({where: {userId}})

  if (!balance) {
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 100,
      },
    })
  };

  redirect("/")
}
