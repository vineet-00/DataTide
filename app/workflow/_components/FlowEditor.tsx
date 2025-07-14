"use client"

import { Workflow } from "@prisma/client"
import { 
  ReactFlow,
  useNodesState,
  useEdgesState, 
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  Connection, 
  addEdge,
  Edge,
  getOutgoers
} from "@xyflow/react"
import { CreateFlowNode } from "@/lib/workflow/createFlowNode"
import { TaskType } from "@/types/task"
import NodeComponent from "@/app/workflow/_components/nodes/NodeComponent"
import DeletableEdge from "@/app/workflow/_components/edges/DeletableEdge"
import { useEffect, useCallback } from "react"
import { AppNode } from "@/types/appNode"
import { TaskRegistry } from "@/lib/workflow/task/registry"

import "@xyflow/react/dist/style.css"

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
}

const edgeTypes = {
  default: DeletableEdge,
}

const snapGrid : [number, number] = [50, 50];
const fitViewOptions = {padding: 1};

export const FlowEditor = ({workflow} : {workflow: Workflow}) => {
  
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const {setViewport, screenToFlowPosition, updateNodeData} = useReactFlow()

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition)
      if (!flow) return;
      
      setNodes(flow.nodes || [])
      setEdges(flow.edges || [])

      if (!flow.viewport) return;
      const {x=0, y=0, zoom=1} = flow.viewport
      setViewport({x, y, zoom})
    } catch(e) {
      console.log(e);
    }
  }, [workflow.definition, setEdges, setNodes, setViewport])

  const onDragOver = useCallback((event : React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect="move"
  }, [])

  const onDrop = useCallback((event : React.DragEvent) => {
    event.preventDefault()
    const taskType = event.dataTransfer.getData("application/reactflow")

    if (typeof taskType === "undefined" || !taskType) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })
    
    const newNode = CreateFlowNode(taskType as TaskType, position)
    setNodes((nds) => nds.concat(newNode))
  }, [screenToFlowPosition, setNodes])

  //  Alternate approach for clearing the field data
  // const onConnect = useCallback((connection: Connection) => {
  //   setEdges((eds) => addEdge({ ...connection }, eds));

  //   if (!connection.targetHandle) return;

  //   setNodes((prevNodes) =>
  //     prevNodes.map((node) => {
  //       if (node.id === connection.target) {
  //         return {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             inputs: {
  //               ...node.data.inputs,
  //             [connection.targetHandle]: "", 
  //           },
  //         },
  //       };
  //     }
  //     return node;
  //   })
  //     );

  //   console.log("@UPDATED NODE", connection.target);
  // }, [setEdges, setNodes]);
    
  const onConnect = useCallback((connection : Connection) => {
    setEdges((eds) => addEdge({...connection}, eds))
    if (!connection.targetHandle) return
    const node = nodes.find((nd) => nd.id === connection.target)
    if(!node) return 
    const nodeInputs = node.data.inputs
    updateNodeData(node.id, {
      inputs:{
        ...nodeInputs,
        [connection.targetHandle]: "",
      },
    })
    // console.log("@UPDATED NODE", node.id);
  }, 
  [setEdges, updateNodeData, nodes]
  )
  // console.log("@NODES", nodes);
  
  const isValidConnection = useCallback((
    connection: Edge | connection
  ) => {
    // No self connections
    if (connection.source === connection.target) {
      return false
    };

    // Same typeParam type connection
    const source = nodes.find((node) => node.id === connection.source)
    const target = nodes.find((node) => node.id === connection.target)
    if (!source || !target) {
      console.error("invalid connection: source or target node not found")
      return false
    };

    const sourceTask = TaskRegistry[source.data.type]
    const targetTask = TaskRegistry[target.data.type]

    const output= sourceTask.outputs.find((o) => o.name === connection.sourceHandle)
    const input= targetTask.inputs.find((i) => i.name === connection.targetHandle)
    if (input?.type !== output?.type) {
      console.error("invalid connection: type mismatch")
      return false
    };

    // console.log("@@DEBUG", {input, output});
    const hasCycle = (node: AppNode, visited = new Set()) => {
      if(visited.has(node.id)) return false;
      visited.add(node.id)

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }

      return false
    }

    const detectedCycle = hasCycle(target)
    return !detectedCycle
  },
  [nodes, edges])

  return (
    <main className="h-full w-full">
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position ="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor