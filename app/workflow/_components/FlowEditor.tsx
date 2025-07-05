"use client"

import { Workflow } from "@prisma/client"
import { 
  ReactFlow,
  useNodesState,
  useEdgesState, 
  Controls,
  Background,
  BackgroundVariant 
} from "@xyflow/react"
import { CreateFlowNode } from "@/lib/workflow/createFlowNode"
import { TaskType } from "@/types/task"
import NodeComponent from "@/app/workflow/_components/nodes/NodeComponent"
import { useReactFlow } from "@xyflow/react"
import { useEffect } from "react"

import "@xyflow/react/dist/style.css"

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
}

const snapGrid : [number, number] = [50, 50];
const fitViewOptions = {padding: 2};

export const FlowEditor = ({workflow} : {workflow: Workflow}) => {
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const {setViewport} = useReactFlow()

  useEffect(() => {
    try {
      console.log("Workflow prop in FlowEditor:", workflow)
      const flow = JSON.parse(workflow.definition)
      if (!flow) return;

      console.log("Setting nodes:", flow.nodes);
    console.log("Setting edges:", flow.edges);
      
      setNodes(flow.nodes || [])
      setEdges(flow.edges || [])

      if (!flow.viewport) return;
      const {x=0, y=0, zoom=1} = flow.viewport
      setViewport({x, y, zoom})
    } catch(e) {
      console.log(e);
    }
  }, [workflow.definition, setEdges, setNodes, setViewport])

  return (
    <main className="h-full w-full">
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
      >
        <Controls position ="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor