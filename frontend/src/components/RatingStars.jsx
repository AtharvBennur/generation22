import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Animated rating stars component
 */
const RatingStars = ({ rating, onRate, readonly = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (value) => {
    if (!readonly && onRate) {
      onRate(value)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <motion.button
          key={value}
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          onClick={() => handleClick(value)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              value <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </motion.button>
      ))}
    </div>
  )
}

export default RatingStars
