import type { ToolFn } from '../../types'
import { z } from 'zod'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import { huggingFaceAI } from '../ai'

export const generateImageToolDefinition = {
  name: 'generate_image',
  description:
    'Generate an image when the user request can be visualized (scenes, objects, people, designs, or abstract ideas). Always use for requests like draw, create, show, imagine, or photo/picture of. Expand the input into a detailed visual prompt with style, lighting, and setting. Avoid for non-visual tasks.',
  parameters: z.object({
    prompt: z
      .string()
      .describe('A detailed visual prompt describing the image to generate.'),
  }),
}

type Args = z.infer<typeof generateImageToolDefinition.parameters>

export const generateImage: ToolFn<Args, string> = async ({ toolArgs }) => {
  // const result = (await huggingFaceAI.textToImage({
  //   provider: 'fal-ai',
  //   model: 'black-forest-labs/FLUX.1-dev',
  //   inputs: toolArgs.prompt,
  //   parameters: { num_inference_steps: 5 },
  // })) as unknown as Blob

  const result = await fetch('https://picsum.photos/500/500')
  const url = result.url

  const buffer = Buffer.from(await result.arrayBuffer())

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const IMAGES_DIR = path.join(__dirname, '../../images')

  await mkdir(IMAGES_DIR, { recursive: true })

  await writeFile(path.join(IMAGES_DIR, `image-${Date.now()}.jpg`), buffer)

  return url
}
