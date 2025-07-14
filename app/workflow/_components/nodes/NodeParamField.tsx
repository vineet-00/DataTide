"use client"
import { TaskParam, TaskParamType } from "@/types/task"
import { AppNode } from "@/types/appNode"
import StringParam from "@/app/workflow/_components/nodes/param/StringParam"
import BrowserInstanceParam from "@/app/workflow/_components/nodes/param/BrowserInstanceParam"
import { updateNodeData, useReactFlow } from "@xyflow/react"
import { useCallback } from "react"

export const NodeParamField = ({param, nodeId, disabled} : {param: TaskParam, nodeId: string, disabled: boolean}) => {
  
  const {updateNodeData, getNode} = useReactFlow()
  const node = getNode(nodeId) as AppNode
  const value = node?.data.inputs?.[param.name]

  const updateNodeParamValue = useCallback(
    (newValue: string) =>{
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue,
        },
      })
    },
    [nodeId, updateNodeData, param.name, node?.data.inputs]
  )

  switch (param.type) {
    case TaskParamType.STRING:
      return (<StringParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled} />);
    case TaskParamType.BROWSER_INSTANCE:
      return (<BrowserInstanceParam param={param} value={""} updateNodeParamValue={updateNodeParamValue} />);
    default:
      return(
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not Implemented</p>
        </div>
      )
  }

}

export default NodeParamField