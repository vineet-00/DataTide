"use server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function GetUserPurchaseHistory () {
  const {userId} = auth()
    if (!userId) {
      throw new Error("unathenticated")
    };

  return prisma.userPurchase.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  })
}