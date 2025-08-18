import Link from 'next/link'
import type { Lesson } from '@/types'

interface LessonCardProps {
  lesson: Lesson
}

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <div className="lesson-card">
      {lesson.metadata.preview_image && (
        <div className="mb-4">
          <img
            src={`${lesson.metadata.preview_image.imgix_url}?w=600&h=300&fit=crop&auto=format,compress`}
            alt={lesson.metadata.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-medium mb-2">
            {lesson.metadata.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            {lesson.metadata.description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-studio-gray px-2 py-1 rounded text-xs text-gray-300">
          {lesson.metadata.skill?.value || 'General'}
        </span>
        <span className="bg-studio-gray px-2 py-1 rounded text-xs text-gray-300">
          {lesson.metadata.difficulty?.value || 'Beginner'}
        </span>
        {lesson.metadata.duration_minutes && (
          <span className="text-gray-400 text-xs">
            {lesson.metadata.duration_minutes} min
          </span>
        )}
      </div>
      
      <Link
        href={`/lessons/${lesson.slug}`}
        className="studio-button w-full text-center block"
      >
        Start Lesson
      </Link>
    </div>
  )
}