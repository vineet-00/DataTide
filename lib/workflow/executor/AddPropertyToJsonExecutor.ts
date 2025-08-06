import { ExecutionEnvironment } from "@/types/executor"
import { AddPropertyToJsonTask } from "@/lib/workflow/task/AddPropertyToJson"
// import { waitFor } from "@/lib/helper/dal"

export async function AddPropertyToJsonExecutor (environment : ExecutionEnvironment<typeof AddPropertyToJsonTask>): Promise<boolean> {
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
    const propertyValue = environment.getInput("Property value")
    if (!propertyValue) {
      environment.log.error("input->propertyValue not defined")
      return false
    };
    
    let json
    try {
      json = JSON.parse(jsonData)
      json[propertyName] = propertyValue
    }catch (error: any) {
  environment.log.error(`Invalid JSON input: ${error.message}`);
  return false;
}

    environment.setOutput("Updated JSON", JSON.stringify(json))

    return true
  } catch(e: any) {
    environment.log.error(e.message);
    return false
  }
}