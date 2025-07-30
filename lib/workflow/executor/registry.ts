import { LaunchBrowserExecutor } from "@/lib/workflow/executor/LaunchBrowserExecutor"
import { PageToHtmlExecutor } from "@/lib/workflow/executor/PageToHtmlExecutor"
import { FillInputExecutor } from "@/lib/workflow/executor/FillInputExecutor"
import { WaitForElementExecutor } from "@/lib/workflow/executor/WaitForElementExecutor"
import { ClickElementExecutor } from "@/lib/workflow/executor/ClickElementExecutor"
import { DeliverViaWebhookExecutor } from "@/lib/workflow/executor/DeliverViaWebhookExecutor"
import { ExtractTextFromElementExecutor } from "@/lib/workflow/executor/ExtractTextFromElementExecutor"
import { TaskType } from "@/types/task"
import { ExecutionEnvironment } from "@/types/executor"
import { WorkflowTask } from "@/types/workflow"

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>) => Promise<boolean>;

type RegistryType = {
  [k in TaskType] : ExecutorFn<WorkflowTask & {type: k}>;
};

export const ExecutorRegistry : RegistryType = {
  LAUNCH_BROWSER : LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
}