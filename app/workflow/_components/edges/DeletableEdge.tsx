"use client"
import { 
  BaseEdge, 
  EdgeProps, 
  getSmoothStepPath,
  EdgeLabelRenderer,
  useReactFlow
} from "@xyflow/react"
import { Button } from "@/components/ui/button"

export const DeletableEdge = (props: EdgeProps) => {
  
  const [edgePath, lableX, labelY] = getSmoothStepPath(props)
  const {setEdges} = useReactFlow()

  return (
    <>
      <BaseEdge 
      path={edgePath}
      markerEnd={props.markerEnd}
      style={props.style}
     />
     <EdgeLabelRenderer>
       <div style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${lableX}px, ${labelY}px)`,
        pointerEvents: "all"
       }}>
         <Button 
         variant={"outline"} 
         size={"icon"} 
         className="w-5 h-5 border cursor-pointer rounded-full text-xs leading-none hover:shadow-lg"
         onClick={() => {
          setEdges((edges) => edges.filter((edge) => edge.id !== props.id))
         }}
         >x</Button>
       </div>
     </EdgeLabelRenderer>

    </>
  )
}

export default DeletableEdge
