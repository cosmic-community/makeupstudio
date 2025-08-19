import { Lesson } from '@/types'

interface LessonCardProps {
  lesson: Lesson
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const difficultyColors = {
    'Beginner': 'text-green-400',
    'Intermediate': 'text-yellow-400',
    'Advanced': 'text-red-400'
  }

  const difficultyValue = lesson.metadata?.difficulty?.value
  const difficultyColor = difficultyValue ? difficultyColors[difficultyValue as keyof typeof difficultyColors] || 'text-gray-400' : 'text-gray-400'

  return (
    <div className="bg-studio-gray rounded-lg overflow-hidden hover:bg-studio-gray-light transition-all duration-300 hover:transform hover:scale-105">
      {lesson.metadata?.preview_image?.imgix_url && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={`${lesson.metadata.preview_image.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
            alt={lesson.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {lesson.metadata?.difficulty?.value && (
            <span className={`text-xs font-medium px-2 py-1 rounded ${difficultyColor} bg-current bg-opacity-20`}>
              {lesson.metadata.difficulty.value}
            </span>
          )}
          {lesson.metadata?.duration_minutes && (
            <span className="text-xs text-gray-400">
              {lesson.metadata.duration_minutes} min
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {lesson.metadata?.title || lesson.title}
        </h3>
        
        {lesson.metadata?.description && (
          <p className="text-gray-400 text-sm line-clamp-3 mb-4">
            {lesson.metadata.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {lesson.metadata?.skill?.value && (
            <span className="text-studio-accent text-sm font-medium">
              {lesson.metadata.skill.value}
            </span>
          )}
          {lesson.metadata?.featured && (
            <span className="text-yellow-400 text-sm">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>
    </div>
  )
}