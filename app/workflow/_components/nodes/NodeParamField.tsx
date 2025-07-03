"use client"
import { TaskParam, TaskParamType, AppNode } from "@/types/task"
import { Input } from "@/components/ui/input"
import StringParam from "@/app/workflow/_components/nodes//param/StringParam"
import { updateNodeData, useReactFlow } from "@xyflow/react"
import { useCallback } from "react"

export const NodeParamField = ({param, nodeId} : {param: TaskParam, nodeId: string}) => {
  
  const {updateNodeData, getNode} = useReactFlow()
  const node = getNode(nodeId) as AppNode
  const value = node?.data.inputs?.[param.name]

  const updateNodeParamValue = useCallback((newValue: string) => {
    updateNodeData(
      nodeId, {
        ...node?.data.inputs,
        [param.name]: newValue,
      }
    )
  }, [nodeId, updateNodeData, param.name, node?.data.inputs])

  switch (param.type) {
    case TaskParamType.STRING:
      return <StringParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} />;
    default:
      return(
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not Implemented</p>
        </div>
      )
  }

}

export default NodeParamField