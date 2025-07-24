import { ExecutionEnvironment } from "@/types/executor"
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml"

export async function PageToHtmlExecutor (environment : ExecutionEnvironment<typeof PageToHtmlTask>): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content()
    environment.setOutput("Html", html)
    return true
  } catch(e: any) {
    environment.log.error(e.message);
    return false
  }
}