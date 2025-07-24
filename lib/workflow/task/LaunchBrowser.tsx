import { TaskType, TaskParamType } from "@/types/task"
import { GlobeIcon, LucideProps } from "lucide-react"
import { WorkflowTask } from "@/types/workflow"

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch browser",
  icon: (props: LucideProps) => (<GlobeIcon className="stroke-pink-400" {...props} />),
  isEntryPoint: true,
  credits: 5,
  inputs: [
    {
      name: "Website Url",
      type: TaskParamType.STRING,
      helperText: "eg: http://www.google.com",
      required: true,
      hideHandle: true,
    },
  ] as const,
  outputs: [
    {name: "Web page", type: TaskParamType.BROWSER_INSTANCE}
  ] as const,
}satisfies WorkflowTask;