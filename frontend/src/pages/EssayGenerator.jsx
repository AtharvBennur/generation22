import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import ChatEssayBox from '../components/ChatEssayBox'
import AnimatedSection from '../components/AnimatedSection'
import { aiAPI } from '../utils/api'
import toast from 'react-hot-toast'
import { useUserStore } from '../store/userStore'

const EssayGenerator = () => {
  const [loading, setLoading] = useState(false)
  const [lastEssay, setLastEssay] = useState(null)
  const { isAuthenticated } = useUserStore()
  const navigate = useNavigate()

  const handleGenerate = async (topic, style, length) => {
    try {
      setLoading(true)
      const response = await aiAPI.generateEssay(topic, style, length)
      setLastEssay(response.essay)
      return response.essay
    } catch (error) {
      console.error('Failed to generate essay:', error)
      toast.error('Failed to generate essay. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAsBlog = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save as blog')
      return
    }
    if (!lastEssay) {
      toast.error('No essay to save')
      return
    }
    // Navigate to blog create page with pre-filled content
    navigate('/blog/create', { state: { content: lastEssay } })
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold mb-4">
            AI <span className="gradient-text">Essay Generator</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Generate comprehensive essays on any topic using advanced AI technology powered by Groq
          </p>
        </AnimatedSection>

        {/* Chat Box */}
        <AnimatedSection delay={0.1}>
          <ChatEssayBox onGenerate={handleGenerate} loading={loading} />
        </AnimatedSection>

        {/* Save as Blog Button */}
        {lastEssay && (
          <AnimatedSection delay={0.2} className="mt-6 text-center">
            <button
              onClick={handleSaveAsBlog}
              className="btn-primary text-lg flex items-center space-x-2 mx-auto"
            >
              <Save className="w-5 h-5" />
              <span>Save as Blog Post</span>
            </button>
          </AnimatedSection>
        )}

        {/* Info Cards */}
        <AnimatedSection delay={0.3} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Multiple Styles',
              description: 'Choose from academic, creative, simple, or formal writing styles',
            },
            {
              title: 'Flexible Length',
              description: 'Generate short, medium, or long essays based on your needs',
            },
            {
              title: 'Save & Share',
              description: 'Convert your AI-generated essays into blog posts instantly',
            },
          ].map((feature, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </AnimatedSection>
      </div>
    </div>
  )
}

export default EssayGenerator
