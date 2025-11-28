/**
 * Skeleton loading card with shimmer effect
 */
const SkeletonCard = () => {
  return (
    <div className="glass-card p-6 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 shimmer" />
      
      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 shimmer" />
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 shimmer" />
      </div>
      
      {/* Tags skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full shimmer" />
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full shimmer" />
      </div>
      
      {/* Footer skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
      </div>
    </div>
  )
}

export default SkeletonCard
