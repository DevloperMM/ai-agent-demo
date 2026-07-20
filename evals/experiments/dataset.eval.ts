import 'dotenv/config'

import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { runLLM } from '../../src/llm'
import { movieSearchDefinition } from '../../src/tools/movieSearch'
import { generateImageToolDefinition } from '../../src/tools/generateImage'
import { redditToolDefinition } from '../../src/tools/reddit'
import { factzToolDefinition } from '../../src/tools/factz'
import { runEval } from '../evalTools'
import { ToolCallMatch } from '../scorers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dataset = JSON.parse(
  readFileSync(join(__dirname, '..', 'dataset.json'), 'utf-8'),
)

const allTools = [
  movieSearchDefinition,
  generateImageToolDefinition,
  redditToolDefinition,
  factzToolDefinition,
]

runEval('dataset', {
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: allTools,
    }),
  data: dataset,
  scorers: [ToolCallMatch],
})
