import { ExecutionEnvironment } from "@/types/executor"
import { ClickElementTask } from "@/lib/workflow/task/ClickElement"
// import { waitFor } from "@/lib/helper/dal"

export async function ClickElementExecutor (environment : ExecutionEnvironment<typeof ClickElementTask>): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector")
    if (!selector) {
      environment.log.error("input->selector not defined")
    };
  
    await environment.getPage()!.click(selector)
    // await waitFor(5000)
    return true
  } catch(e: any) {
    environment.log.error(e.message);
    return false
  }
}