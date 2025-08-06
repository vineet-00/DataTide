// import { ExecutionEnvironment } from "@/types/executor"
// import { ExtractDataWithAITask } from "@/lib/workflow/task/ExtractDataWithAI"
// // import { waitFor } from "@/lib/helper/dal"
// import prisma from "@/lib/prisma"
// import { symmetricDecrypt } from "@/lib/encryption"
// import OpenAI from "openai"

// export async function ExtractDataWithAiExecutor (environment : ExecutionEnvironment<typeof ExtractDataWithAITask>): Promise<boolean> {
//   try {
//     const credentials = environment.getInput("Credentials")
//     if (!credentials) {
//       environment.log.error("input->credentials not defined")
//       return false
//     };
//     const prompt = environment.getInput("Prompt")
//     if (!prompt) {
//       environment.log.error("input->prompt not defined")
//       return false
//     };
//     const content = environment.getInput("Content")
//     if (!content) {
//       environment.log.error("input->content not defined")
//       return false
//     };

//     //Get credential from db
//     const credential = await prisma.credential.findUnique(
//       { 
//         where: { id: credentials } 
//       })
  
//     if (!credential) {
//       environment.log.error("credential not found")
//       return false
//     };

//     const plainValue = symmetricDecrypt(credential.value)
//     if (!plainValue) {
//       environment.log.error("cannot decrypt credential")
//       return false
//     };

//     // const mockExtractedData = {
//     //   usernameSelector: "#username",
//     //   passwordSelector: "#password",
//     //   loginSelector: "body > div > form > input.btn.btn-primary",
//     // }
//     // environment.setOutput("Extracted data", JSON.stringify(mockExtractedData))

//     // const openai = new OpenAI({
//     //   apiKey: plainValue,
//     // }) 

//     // OPEN AI code
//     // const response = await openai.chat.completions.create({
//     //     model: "gpt-4o-mini",
//     //     messages: [
//     //       {
//     //         role: "system",
//     //         content: 
//     //         `You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and 
//     //         also the prompt with the data you want to extract. The response should always be only the extracted data as a JSON array or object, 
//     //         without any additional word or explanations. Analyze the input carefully and extract data precisely based on the prompt.
//     //         If no data found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text.`,
//     //       },
//     //       {
//     //         role: "user",
//     //         content: content,
//     //       },
//     //       {
//     //         role: "user",
//     //         content: prompt,
//     //       },
//     //     ],
//     //     temperature: 1,
//     // })
    
//     const response = await fetch('https://api.together.xyz/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${plainValue}`, // Your Together.ai API key
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // or another model
//         messages: [
//           {
//             role: "system",
//             content: `You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and 
//             also the prompt with the data you want to extract. The response should always be only the extracted data as a JSON array or object, 
//             without any additional word or explanations. Analyze the input carefully and extract data precisely based on the prompt.
//             If no data found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text.`,
//           },
//           {
//             role: "user",
//             content: content,
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 1,
//         max_tokens: 512
//       })
//     })

//     if (!response.ok) {
//       environment.log.error(`Together.ai API error: ${response.status} ${response.statusText}`)
//       return false
//     }

//     const data = await response.json()

//     // OpenAI
//     // environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`)
//     // environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`)
//     // const result = response.choices[0].message?.content;
    
    
//     environment.log.info(`Prompt tokens: ${data.usage?.prompt_tokens}`)
//     environment.log.info(`Completion tokens: ${data.usage?.completion_tokens}`)
//     const result = data.choices[0].message?.content;
//     if (!result) {
//       environment.log.error("empty response from AI")
//       return false
//     };

//     environment.setOutput("Extracted data", result)

//     return true
//   } catch(e: any) {
//     environment.log.error(e.message);
//     return false
//   }
// }




import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "@/lib/workflow/task/ExtractAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";

/**
 * Helper function to clean code block delimiters from AI response.
 */
function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7).trim();
  } else if (cleaned.startsWith("\`\`\`")) {
    cleaned = cleaned.substring(3).trim();
  }

  if(cleaned.endsWith("\`\`\`")) {
    cleaned = cleaned.substring(0, cleaned.length - 3).trim();
  }

  return cleaned;
}


export async function ExtractDataWithAiExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    // Validate required inputs
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input->Credentials not defined");
      return false;
    }
    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input->Prompt not defined");
      return false;
    }
    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input->Content not defined");
      return false;
    }

    // Fetch stored encrypted API key
    const credential = await prisma.credential.findUnique({
      where: { id: credentials },
    });

    if (!credential) {
      environment.log.error("Credential record not found");
      return false;
    }

    // Decrypt the API key
    const apiKey = symmetricDecrypt(credential.value);
    if (!apiKey) {
      environment.log.error("Failed to decrypt API key");
      return false;
    }

    environment.log.info(
      `Using API key: ${apiKey.substring(0, 4)}****${apiKey.slice(-4)}`
    );

    // Prepare prompt for Together.ai, emphasize simpler CSS selectors
    const systemPrompt = `
You are a web scraper helper AI. Your goal is to extract requested CSS selectors clearly and simply.

Rules:
1. Use #id selectors when possible.
2. Use .class selectors when id is not available.
3. Avoid overcomplicated selectors like [name="..."] or input#id[name="..."] unless necessary.
4. Output only valid JSON, no markdown, no code blocks, no extra text.
5. Return empty JSON {} or [] if no relevant data found.

Examples:
- For <input id="username">, output "#username"
- For <input id="password">, output "#password"
- For <button class="submit-btn">, output ".submit-btn"

Respond ONLY with the JSON object containing the requested selectors.
`;

    // Compose request for Together.ai API
    const requestBody = {
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt.trim(),
        },
        {
          role: "user",
          content: `Extract these selectors from following HTML:\n${content}\nPrompt: ${prompt}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 512,
    };

    environment.log.info(
      `Request sent to Together.ai: ${JSON.stringify(requestBody, null, 2)}`
    );

    // Call Together.ai API
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      environment.log.error(
        `Together.ai API error ${response.status}: ${response.statusText}`
      );
      environment.log.error(`API error detail: ${errText}`);
      return false;
    }

    const data = await response.json();

    environment.log.info(`Together.ai response: ${JSON.stringify(data, null, 2)}`);

    const aiOutput = data.choices?.[0]?.message?.content;

    if (!aiOutput) {
      environment.log.error("AI response content is empty");
      return false;
    }

    // Clean markdown/code block formatting if present
    const cleanedOutput = cleanJsonResponse(aiOutput);

    // Validate output is valid JSON
    try {
      JSON.parse(cleanedOutput);
    } catch (err) {
      environment.log.error(
        `Extracted data is not valid JSON: ${cleanedOutput}`
      );
      return false;
    }

    // Set cleaned JSON string as output for downstream nodes
    environment.setOutput("Extracted data", cleanedOutput);

    return true;
  } catch (error: any) {
    environment.log.error(`Executor failure: ${error.message}`);
    return false;
  }
}
