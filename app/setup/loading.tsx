import Logo from "@/components/Logo"
import { Separator } from "@/components/ui/separator"
import { Loader2Icon } from "lucide-react"

export const loading = () => {
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
      <Logo iconsize={50} fontSize="text-3xl" />
      <Separator className="max-w-xs" />
      <div className="flex items-center gap-2 justify-center">
        <Loader2Icon size={16} className="animate-spin stroke-primary" />
        <p className="text-muted-foreground">Setting up your account</p>
      </div>
    </div>
  )
}

export default loading
