import Link from 'next/link'
import type { Lesson, LookPreset, GalleryShowcase } from '@/types'

interface FeaturedContentProps {
  lessons: Lesson[]
  presets: LookPreset[]
  gallery: GalleryShowcase[]
}

export default function FeaturedContent({ lessons, presets, gallery }: FeaturedContentProps) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Learn & Practice</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore lessons, presets, and inspiration from our community
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Lessons */}
          <div className="bg-studio-dark rounded-lg border border-studio-gray p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Featured Lessons</h3>
              <Link 
                href="/lessons"
                className="text-studio-accent hover:text-studio-accent-light transition-colors text-sm"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {lessons.slice(0, 3).map((lesson) => (
                <div key={lesson.id} className="border-b border-studio-gray pb-4 last:border-b-0">
                  <h4 className="text-white font-medium mb-1">
                    {lesson.metadata.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">
                    {lesson.metadata.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-studio-gray px-2 py-1 rounded text-gray-300">
                      {lesson.metadata.difficulty?.value || 'Beginner'}
                    </span>
                    {lesson.metadata.duration_minutes && (
                      <span className="text-gray-400">
                        {lesson.metadata.duration_minutes} min
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {lessons.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                No lessons available yet
              </p>
            )}
          </div>

          {/* Popular Presets */}
          <div className="bg-studio-dark rounded-lg border border-studio-gray p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Popular Presets</h3>
              <Link 
                href="/presets"
                className="text-studio-accent hover:text-studio-accent-light transition-colors text-sm"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {presets.slice(0, 3).map((preset) => (
                <div key={preset.id} className="border-b border-studio-gray pb-4 last:border-b-0">
                  <h4 className="text-white font-medium mb-1">
                    {preset.metadata.name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">
                    {preset.metadata.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-studio-gray px-2 py-1 rounded text-gray-300">
                      {preset.metadata.category?.value || 'Classic'}
                    </span>
                    <span className="bg-studio-accent px-2 py-1 rounded text-white">
                      {preset.metadata.complexity?.value || 'Simple'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {presets.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                No presets available yet
              </p>
            )}
          </div>

          {/* Gallery Showcase */}
          <div className="bg-studio-dark rounded-lg border border-studio-gray p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Inspiration</h3>
            </div>
            
            <div className="space-y-4">
              {gallery.slice(0, 1).map((showcase) => (
                <div key={showcase.id}>
                  {showcase.metadata.featured_images && showcase.metadata.featured_images.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={`${showcase.metadata.featured_images[0].imgix_url}?w=400&h=300&fit=crop&auto=format,compress`}
                        alt={showcase.metadata.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <h4 className="text-white font-medium mb-2">
                    {showcase.metadata.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    {showcase.metadata.description}
                  </p>
                  
                  {showcase.metadata.techniques && (
                    <div className="flex flex-wrap gap-2">
                      {showcase.metadata.techniques.slice(0, 3).map((technique, index) => (
                        <span 
                          key={index}
                          className="bg-studio-gray px-2 py-1 rounded text-xs text-gray-300"
                        >
                          {technique}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {gallery.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-studio-gray rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🖼️</span>
                </div>
                <p className="text-gray-400">
                  Community showcases coming soon
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}