"use client"

import React from "react"
import { Workflow } from "@prisma/client"
import { ReactFlowProvider } from "@xyflow/react"
import FlowEditor from "@/app/workflow/_components/FlowEditor"
import Topbar from "@/app/workflow/_components/topbar/Topbar"
import TaskMenu from "@/app/workflow/_components/TaskMenu"
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext"


export const Editor = ({workflow}: {workflow: Workflow}) => {
  
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar title="Workflow editor" subtitle={workflow.name} workflowId={workflow.id} />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  )
}

export default Editor