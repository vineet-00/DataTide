"use server"
import { PackId, getCreditsPack } from "@/types/billing"
import { auth } from "@clerk/nextjs/server"
import { stripe } from "@/lib/stripe/stripe"
import { getAppUrl } from "@/lib/helper/appUrl"
import { redirect } from "next/navigation"

export async function PurchaseCredits (packId: PackId) {
  try{
    const {userId} = auth()
    if (!userId) {
      throw new Error("unauthenticated")
    };
    
    const selectedPack = getCreditsPack(packId)
    if (!selectedPack) {
      throw new Error("invalid pack")
    };

    const priceId = selectedPack?.priceId

    const session= await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "usd",
      locale: 'en',
      invoice_creation: {
        enabled: true,
      },
      success_url: getAppUrl("billing"),
      cancel_url: getAppUrl("billing"),
      metadata: {
        userId,
        packId,
      },
      line_items: [
        {
          quantity: 1,
          price: selectedPack.priceId,
        },
      ],
    })

    if (!session.url) {
      throw new Error("cannot create stripe session")
    };

    redirect(session.url)
  }catch(e){
    console.error("PurchaseCredits error:", e)
    throw e
  }
}