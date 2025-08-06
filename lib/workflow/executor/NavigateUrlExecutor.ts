import { ExecutionEnvironment } from "@/types/executor"
import { NavigateUrlTask } from "@/lib/workflow/task/NavigateUrlTask"
// import { waitFor } from "@/lib/helper/dal"

export async function NavigateUrlExecutor (environment : ExecutionEnvironment<typeof NavigateUrlTask>): Promise<boolean> {
  try {
    const url = environment.getInput("URL")
    if (!url) {
      environment.log.error("input->url not defined")
    };
  
    await environment.getPage()!.goto(url)
    environment.log.info(`visited ${url}`)
    // await waitFor(5000)
    return true
  } catch(e: any) {
    environment.log.error(e.message);
    return false
  }
}