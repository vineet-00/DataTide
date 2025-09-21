import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Globe2 } from "lucide-react"

export const Logo = ({
  fontSize = "text-2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) => {
  return (
    <Link
      href="/"
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2",
        fontSize
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 p-2">
        <Globe2 size={iconSize} className="stroke-white" />
      </div>
      <div>
        <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
          Data
        </span>
        <span className="text-gray-800 dark:text-gray-200">Tide</span>
      </div>
    </Link>
  )
}

export default Logo