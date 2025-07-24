"use client"
import { useQuery } from "@tanstack/react-query"
import { GetAvailbleCredits } from "@/actions/billing/getAvailableCredits"
import Link from "next/link"
import { CoinsIcon, Loader2Icon } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"

export const UserAvailableCreditsBadge = () => {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetAvailbleCredits(),
    refetchInterval: 30*1000, //30 seconds
  });

  return (
    <Link href={"/billing"} className={cn("w-full space-x-2 items-center")} >
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
        {!query.isLoading && query.data && query.data}
        {!query.isLoading && !query.data && "-"}
      </span>
    </Link>
  )
}

export default UserAvailableCreditsBadge