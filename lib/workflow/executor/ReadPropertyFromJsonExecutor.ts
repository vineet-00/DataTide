import { ExecutionEnvironment } from "@/types/executor"
import { ReadPropertyFromJsonTask } from "@/lib/workflow/task/ReadPropertyFromJson"
// import { waitFor } from "@/lib/helper/dal"

export async function ReadPropertyFromJsonExecutor (environment : ExecutionEnvironment<typeof ReadPropertyFromJsonTask>): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON")
    if (!jsonData) {
      environment.log.error("input->jsonData not defined")
      return false
    };
    const propertyName = environment.getInput("Property name")
    if (!propertyName) {
      environment.log.error("input->propertyName not defined")
      return false
    };
    
    let json
    try {
      json = JSON.parse(jsonData)
    } catch (err) {
      environment.log.error("invalid JSON input")
      return false
    }
    const propertyValue = json[propertyName]
    if (propertyValue === undefined) {
      environment.log.error("property not found")
      return false
    };

    environment.setOutput("Property value", propertyValue)

    return true
  } catch(e: any) {
    environment.log.error(e.message);
    return false
  }
}