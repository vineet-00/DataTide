import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser"
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml"
import { FillInputTask } from "@/lib/workflow/task/FillInput"
import { WaitForElementTask } from "@/lib/workflow/task/WaitForElement"
import { ClickElementTask } from "@/lib/workflow/task/ClickElement"
import { ExtractDataWithAITask } from "@/lib/workflow/task/ExtractDataWithAI"
import { DeliverViaWebhookTask } from "@/lib/workflow/task/DeliverViaWebhook"
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement"
import { ReadPropertyFromJsonTask } from "@/lib/workflow/task/ReadPropertyFromJson"
import { AddPropertyToJsonTask } from "@/lib/workflow/task/AddPropertyToJson"
import { NavigateUrlTask } from "@/lib/workflow/task/NavigateUrlTask"
import { ScrollToElementTask } from "@/lib/workflow/task/ScrollToElement"
import { TaskType } from "@/types/task"
import { WorkflowTask } from "@/tasks/workflow"

type Registry = {
  [K in TaskType]: WorkflowTask & {type: K} ;
}

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
};

