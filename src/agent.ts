import openai from "./ai"
import { systemPrompt } from "./systemPrompt"

const MODEL_NAME = "gpt-4o-mini"

export const runAgent = async ({ userMessage }: { userMessage: string }) => {
  const response = await openai.chat.completions.create({
    model: MODEL_NAME,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  })

  console.log(response.choices[0].message.content)
}
