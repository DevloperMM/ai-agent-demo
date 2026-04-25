import { runLLM } from './llm'
import type { AIMessage } from '../types'
import { runTool } from './toolRunner'

export const runAgent = async (userMessage: string, tools: any[]) => {
  const messages: AIMessage[] = [{ role: 'user', content: userMessage }]

  while (true) {
    const response = await runLLM({ messages, tools })
    messages.push(response)

    if (response.content) {
      console.log(response.content)
      break
    }

    if (response.tool_calls) {
      const toolCall = response.tool_calls[0]

      if (toolCall.type === 'function') {
        const toolResponse = await runTool(toolCall, userMessage)
        messages.push({
          role: 'tool',
          content: toolResponse,
          tool_call_id: toolCall.id,
        })
      }
    }
  }
}
