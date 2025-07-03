"use client"

import React from "react"
import { Workflow } from "@prisma/client"
import { ReactFlowProvider } from "@xyflow/react"
import FlowEditor from "@/app/workflow/_components/FlowEditor"
import Topbar from "@/app/workflow/_components/topbar/Topbar"


export const Editor = ({workflow}: {workflow: Workflow}) => {
  
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Topbar title="Workflow editor" subtitle={workflow.name} />
        <section className="flex h-full overflow-auto">
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  )
}

export default Editor