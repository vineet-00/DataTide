import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SquareDashedMousePointer } from "lucide-react"

export const Logo = ({
  fontSize = "text-2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) => {
  
  return <Link href="/" className={cn(
      "text-2xl font-extrabold flex items-center gap-2", 
      fontSize
    )}> 

    {/*For Green theme*/}
    {/*<div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
      <SquareDashedMousePointer size={iconSize} className="stroke-white" />
    </div>
    <div>
      <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
        Flow
      </span>*/}

      {/*For Rose Theme*/}
    {/*<div className="rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 p-2">
      <SquareDashedMousePointer size={iconSize} className="stroke-white" />
    </div>
    <div>
      <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
        Flow
      </span>*/}

      {/*For Warm Autumn Theme*/}
      <div className="rounded-xl bg-gradient-to-r from-red-700 to-orange-500 p-2">
        <SquareDashedMousePointer size={iconSize} className="stroke-white" />
      </div>
      <span className="bg-gradient-to-r from-red-700 to-orange-500 bg-clip-text text-transparent">
        Flow
      </span>

      <span className="text-stone-700 dark:text-stone-300">Scrape</span>
  </Link>
}

export default Logo