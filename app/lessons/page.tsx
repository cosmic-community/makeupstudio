import Link from 'next/link'
import { getLessons } from '@/lib/cosmic'
import LessonCard from '@/components/LessonCard'
import Navigation from '@/components/Navigation'

export default async function LessonsPage() {
  const lessons = await getLessons()

  return (
    <div className="min-h-screen bg-studio-darker">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Practice Mode</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Follow step-by-step guides with live overlays. Your work stays on your device.
          </p>
        </div>

        {lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-studio-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Lessons Available</h3>
            <p className="text-gray-400 mb-6">
              Lessons help you practice techniques with overlays.
            </p>
            <Link 
              href="/" 
              className="studio-button"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* Getting Started Section */}
        <div className="mt-20 bg-studio-dark rounded-lg border border-studio-gray p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Getting Started with Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-studio-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-medium text-white mb-2">Choose a Lesson</h3>
              <p className="text-gray-400 text-sm">Select a technique you want to practice</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-studio-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-medium text-white mb-2">Upload Your Photo</h3>
              <p className="text-gray-400 text-sm">Use your current photo or choose another</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-studio-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-medium text-white mb-2">Follow the Guide</h3>
              <p className="text-gray-400 text-sm">Practice with live overlays and instructions</p>
            </div>
          </div>
        </div>

        {/* Filter by Difficulty */}
        {lessons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">Browse by Difficulty</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-studio-dark rounded-lg border border-studio-gray p-6">
                <h3 className="font-medium text-white mb-2">Beginner</h3>
                <p className="text-gray-400 text-sm mb-4">Perfect for starting out</p>
                <div className="space-y-2">
                  {lessons
                    .filter(lesson => lesson.metadata.difficulty?.value === 'Beginner')
                    .slice(0, 3)
                    .map(lesson => (
                      <Link 
                        key={lesson.id}
                        href={`/lessons/${lesson.slug}`}
                        className="block text-studio-accent hover:text-studio-accent-light transition-colors text-sm"
                      >
                        {lesson.metadata.title}
                      </Link>
                    ))}
                </div>
              </div>
              
              <div className="bg-studio-dark rounded-lg border border-studio-gray p-6">
                <h3 className="font-medium text-white mb-2">Intermediate</h3>
                <p className="text-gray-400 text-sm mb-4">Build on your skills</p>
                <div className="space-y-2">
                  {lessons
                    .filter(lesson => lesson.metadata.difficulty?.value === 'Intermediate')
                    .slice(0, 3)
                    .map(lesson => (
                      <Link 
                        key={lesson.id}
                        href={`/lessons/${lesson.slug}`}
                        className="block text-studio-accent hover:text-studio-accent-light transition-colors text-sm"
                      >
                        {lesson.metadata.title}
                      </Link>
                    ))}
                </div>
              </div>
              
              <div className="bg-studio-dark rounded-lg border border-studio-gray p-6">
                <h3 className="font-medium text-white mb-2">Advanced</h3>
                <p className="text-gray-400 text-sm mb-4">Master complex techniques</p>
                <div className="space-y-2">
                  {lessons
                    .filter(lesson => lesson.metadata.difficulty?.value === 'Advanced')
                    .slice(0, 3)
                    .map(lesson => (
                      <Link 
                        key={lesson.id}
                        href={`/lessons/${lesson.slug}`}
                        className="block text-studio-accent hover:text-studio-accent-light transition-colors text-sm"
                      >
                        {lesson.metadata.title}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}