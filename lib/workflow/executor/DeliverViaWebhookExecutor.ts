import { ExecutionEnvironment } from "@/types/executor"
import { DeliverViaWebhookTask } from "@/lib/workflow/task/DeliverViaWebhook"
// import { waitFor } from "@/lib/helper/dal"

export async function DeliverViaWebhookExecutor (environment : ExecutionEnvironment<typeof DeliverViaWebhookTask>): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target URL")
    if (!targetUrl) {
      environment.log.error("input->targetUrl not defined")
      return false
    };

    const body = environment.getInput("Body")
    if (!body) {
      environment.log.error("input->body not defined")
      return false
    };
  
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const statusCode = response.status
    if (statusCode !== 200 ) {
      environment.log.error(`status code: ${statusCode}`)
      return false
    };

    const responseBody = await response.json()
    environment.log.info(JSON.stringify(responseBody, null, 4))

    return true
  } catch(e: any) {
    environment.log.error(e.message);
    return false
  }
}