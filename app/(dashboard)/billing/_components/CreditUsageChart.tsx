"use client"
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card"
import { 
  ChartConfig, 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { BarChart, CartesianGrid, XAxis, Bar } from "recharts"
import { ChartColumnStackedIcon } from "lucide-react"

type ChartData = Awaited<ReturnType<typeof GetCreditUsageInPeriod>>
const chartConfig = {
  success: {
    label: "Successfull Phase Credits",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed Phases Credits",
    color: "hsl(var(--chart-1))",
  },
}

export const CreditUsageChart = ({data, title, description}: {data: ChartData; title: string; description: string}) => {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart data={data} height={200} accessibilityLayer margin={{top:20}} >
            <CartesianGrid vertical={false} />
            <XAxis 
              dataKey={"date"}
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
              minTickGap={32} 
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
            }} 
             />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent className="w-[250px]" />}/>
            <Bar 
              fillOpacity={0.8}
              radius={0,0,4,4} 
              fill="var(--color-success)" 
              stroke="var(--color-success)" 
              dataKey={"success"} 
              stackId={"a"} 
              />
            <Bar
              fillOpacity={0.8}
              radius={4,4,0,0} 
              fill="var(--color-failed)" 
              stroke="var(--color-failed)" 
              dataKey={"failed"} 
              stackId={"a"} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default CreditUsageChart