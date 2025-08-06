import "server-only"
import Stripe from "stripe"
import { getCreditsPack, PackId } from "@/types/billing"
import prisma from "@/lib/prisma"

export async function HandleCheckoutSessionCompleted (event: Stripe.Checkout.Session) {
  
  if (!event.metadata) {
    throw new Error("missing metadata")
  };

  const {userId, packId} = event.metadata
  if (!userId) {
    throw new Error("missing userId")
  };
  if (!packId) {
    throw new Error("missing packId")
  };

  const purchasedPack = getCreditsPack(packId as PackId)
  if (!purchasedPack) {
    throw new Error("Purchase pack not found")
  };

  await prisma.userBalance.upsert({
    where: {userId},
    create: {
      userId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment:purchasedPack.credits,
      },
    },
  })

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    }
  })
}