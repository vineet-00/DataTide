import { Node } from "@xyflow/react"
import { TaskType } from "@/types/task"

export interface AppNodeData{
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface AppNode extends Node{

}

export interface ParamProps{
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void; 
}