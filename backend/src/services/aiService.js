import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Generate essay using Groq AI
 */
export const generateEssay = async (topic, style = 'academic', length = 'medium') => {
  try {
    // Determine word count based on length
    const wordCounts = {
      short: '250',
      medium: '500',
      long: '1000',
    }
    const wordCount = wordCounts[length] || '500'

    // Create prompt based on style
    const stylePrompts = {
      academic: `Write a well-researched academic essay about "${topic}". Use formal language, include citations where appropriate, and maintain an objective tone. The essay should be approximately ${wordCount} words.`,
      creative: `Write a creative and engaging essay about "${topic}". Use vivid language, storytelling techniques, and make it interesting to read. The essay should be approximately ${wordCount} words.`,
      simple: `Write a simple and easy-to-understand essay about "${topic}". Use clear language that anyone can understand. Avoid jargon. The essay should be approximately ${wordCount} words.`,
      formal: `Write a formal essay about "${topic}". Use professional language and maintain a serious, authoritative tone throughout. The essay should be approximately ${wordCount} words.`,
    }

    const prompt = stylePrompts[style] || stylePrompts.academic

    // Call Groq API
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.1-70b-versatile', // Using Llama 3.1 70B model
        messages: [
          {
            role: 'system',
            content: 'You are an expert essay writer. Write comprehensive, well-structured essays on any topic.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const essay = response.data.choices[0].message.content
    return essay
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message)
    throw new Error('Failed to generate essay')
  }
}

/**
 * Refine existing essay
 */
export const refineEssay = async (essay, instructions) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert essay editor. Refine and improve essays based on user instructions.',
          },
          {
            role: 'user',
            content: `Here is an essay:\n\n${essay}\n\nPlease refine it based on these instructions: ${instructions}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const refinedEssay = response.data.choices[0].message.content
    return refinedEssay
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message)
    throw new Error('Failed to refine essay')
  }
}

export default {
  generateEssay,
  refineEssay,
}
