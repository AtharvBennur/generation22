import { generateEssay, refineEssay } from '../services/aiService.js'
import { validateAIGenerationData } from '../services/validationService.js'

/**
 * Generate essay using AI
 */
export const generateAIEssay = async (req, res) => {
  try {
    const { topic, style = 'academic', length = 'medium' } = req.body

    const validation = validateAIGenerationData({ topic, style, length })
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(', ') })
    }

    const essay = await generateEssay(topic, style, length)

    res.json({
      essay,
      metadata: {
        topic,
        style,
        length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Generate essay error:', error)
    res.status(500).json({ error: 'Failed to generate essay' })
  }
}

/**
 * Refine existing essay
 */
export const refineAIEssay = async (req, res) => {
  try {
    const { essay, instructions } = req.body

    if (!essay || !instructions) {
      return res.status(400).json({ error: 'Essay and instructions are required' })
    }

    const refinedEssay = await refineEssay(essay, instructions)

    res.json({
      essay: refinedEssay,
      metadata: {
        refinedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Refine essay error:', error)
    res.status(500).json({ error: 'Failed to refine essay' })
  }
}

export default {
  generateAIEssay,
  refineAIEssay,
}
