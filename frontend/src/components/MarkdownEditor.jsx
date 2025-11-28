import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Eye, Edit } from 'lucide-react'

/**
 * Markdown editor with live preview
 */
const MarkdownEditor = ({ value, onChange, placeholder = 'Write your content in Markdown...' }) => {
  const [mode, setMode] = useState('edit') // 'edit' or 'preview'

  return (
    <div className="glass-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setMode('edit')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              mode === 'edit'
                ? 'bg-purple-600 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              mode === 'preview'
                ? 'bg-purple-600 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Markdown supported
        </span>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {mode === 'edit' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[400px] p-6 bg-transparent resize-none focus:outline-none font-mono text-sm"
          />
        ) : (
          <div className="p-6 markdown-content">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">Nothing to preview yet...</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor
