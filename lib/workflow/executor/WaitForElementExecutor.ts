import { ExecutionEnvironment } from "@/types/executor"
import { WaitForElementTask } from "@/lib/workflow/task/WaitForElement"
// import { waitFor } from "@/lib/helper/dal"

export async function WaitForElementExecutor (environment : ExecutionEnvironment<typeof WaitForElementTask>): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector")
    if (!selector) {
      environment.log.error("input->selector not defined")
    };

    const visibility = environment.getInput("Visibility")
    if (!visibility) {
      environment.log.error("input->visibility not defined")
    };
  
    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    })
    environment.log.info(`Element ${selector} became: ${visibility}`)
    // await waitFor(5000)
    return true
  } catch(e: any) {
    environment.log.error(e.message);
    return false
  }
}