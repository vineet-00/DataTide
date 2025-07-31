"use client"
import React from "react"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {MobileSidebar} from "@/components/Sidebar"


export const BreadcrumbHeader = () => {
  
  const pathName = usePathname();
  const paths = pathName === "/" ? [""] : pathName?.split("/");

  return (
    <div className="flex items-center flex-start">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path,index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink className="capitalize" href={`/${path}`}>
                    {path === "" ? "home" : path}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index !== paths.length-1 && <BreadcrumbSeparator / >}
              </React.Fragment>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default BreadcrumbHeader