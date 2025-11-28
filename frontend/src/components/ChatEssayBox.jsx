import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader, Sparkles, Copy, Check, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Chat-style essay generator box with typing animation
 */
const ChatEssayBox = ({ onGenerate, loading }) => {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('academic')
  const [length, setLength] = useState('medium')
  const [copied, setCopied] = useState(false)
  const [messages, setMessages] = useState([])

  const styles = [
    { value: 'academic', label: 'Academic' },
    { value: 'creative', label: 'Creative' },
    { value: 'simple', label: 'Simple' },
    { value: 'formal', label: 'Formal' },
  ]

  const lengths = [
    { value: 'short', label: 'Short (~250 words)' },
    { value: 'medium', label: 'Medium (~500 words)' },
    { value: 'long', label: 'Long (~1000 words)' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    // Add user message
    const userMessage = {
      type: 'user',
      content: `Generate a ${length} ${style} essay about: ${topic}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Generate essay
    const essay = await onGenerate(topic, style, length)
    
    if (essay) {
      // Add AI message
      const aiMessage = {
        type: 'ai',
        content: essay,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }
  }

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setMessages([])
    setTopic('')
  }

  return (
    <div className="glass-card">
      {/* Chat Messages */}
      <div className="h-[500px] overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 animate-float">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">AI Essay Generator</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Enter a topic and let AI generate a comprehensive essay for you. Choose your preferred style and length.
              </p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'glass'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold">AI Generated</span>
                      </div>
                      <button
                        onClick={() => handleCopy(message.content)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass p-4 rounded-2xl flex items-center space-x-2">
              <Loader className="w-5 h-5 animate-spin text-purple-600" />
              <span>Generating essay...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Input */}
          <div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter essay topic (e.g., 'AI in Healthcare')"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Style and Length */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="input-field"
                disabled={loading}
              >
                {styles.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="input-field"
                disabled={loading}
              >
                {lengths.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Generate Essay</span>
                </>
              )}
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary flex items-center space-x-2"
                disabled={loading}
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatEssayBox
