import { ExecutionEnvironment } from "@/types/executor"
import { ScrollToElementTask } from "@/lib/workflow/task/ScrollToElement"
// import { waitFor } from "@/lib/helper/dal"

export async function ScrollToElementExecutor (environment : ExecutionEnvironment<typeof ScrollToElementTask>): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector")
    if (!selector) {
      environment.log.error("input->selector not defined")
    };
  
    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector)
      if (!element) {
        throw new Error("element not found")
      };
      const top = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({top})
    }, selector)
    // await waitFor(5000)
    return true
  } catch(e: any) {
    environment.log.error(e.message);
    return false
  }
}