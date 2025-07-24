import puppeteer from "puppeteer"
// import { waitFor } from "@/lib/helper/dal"
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser"
import { ExecutionEnvironment } from "@/types/executor"

export async function LaunchBrowserExecutor (environment : ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url")
    const browser = await puppeteer.launch({
      headless: true,
    })
    environment.log.info("Browser started successfully")
    environment.setBrowser(browser)
    const page = await browser.newPage()
    await page.goto(websiteUrl)
    environment.setPage(page)
    environment.log.info(`Opened page at: ${websiteUrl}`)
    return true
  } catch(e: any) {
    environment.log.error(e.message);
    return false
  }
}