"use client"
import { Period } from "@/types/analytics"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useRouter ,useSearchParams } from "next/navigation"

const MONTH_NAME = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const PeriodSelector = ({periods, selectedPeriod}: {periods: Period[]; selectedPeriod?: Period}) => {
  
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <Select 
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={
        (value) => {
          const [month, year] = value.split("-");
          const params = new URLSearchParams(searchParams)
          params.set("month", month)
          params.set("year", year)
          router.push(`?${params.toString()}`)
        }
    }>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>
            {`${MONTH_NAME[period.month]} ${period.year}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PeriodSelector