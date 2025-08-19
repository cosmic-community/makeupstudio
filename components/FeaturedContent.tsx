import { Lesson, LookPreset, GalleryShowcase } from '@/types'
import LessonCard from './LessonCard'
import PresetCard from './PresetCard'

interface FeaturedContentProps {
  lessons: Lesson[]
  presets: LookPreset[]
  gallery: GalleryShowcase[]
}

export default function FeaturedContent({ lessons, presets, gallery }: FeaturedContentProps) {
  return (
    <div className="py-20 bg-studio-dark">
      <div className="max-w-7xl mx-auto px-4">
        {/* Featured Lessons */}
        {lessons.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Featured Lessons</h2>
              <p className="text-gray-400 text-lg">
                Master professional makeup techniques with our step-by-step guides
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </section>
        )}

        {/* Popular Presets */}
        {presets.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Popular Look Presets</h2>
              <p className="text-gray-400 text-lg">
                Try these trending makeup looks and customize them to your style
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {presets.map((preset) => (
                <PresetCard key={preset.id} preset={preset} />
              ))}
            </div>
          </section>
        )}

        {/* Gallery Showcase */}
        {gallery.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Inspiration Gallery</h2>
              <p className="text-gray-400 text-lg">
                Get inspired by stunning makeup artistry from our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery.map((item) => (
                <div key={item.id} className="bg-studio-gray rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                  {item.metadata?.featured_images && item.metadata.featured_images.length > 0 && (
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={`${item.metadata.featured_images[0]?.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    {item.metadata?.description && (
                      <p className="text-gray-400 mb-4 line-clamp-3">{item.metadata.description}</p>
                    )}
                    
                    {item.metadata?.techniques && item.metadata.techniques.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.metadata.techniques.slice(0, 3).map((technique: string, index: number) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-studio-accent/20 text-studio-accent text-xs rounded-full"
                          >
                            {technique}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {lessons.length === 0 && presets.length === 0 && gallery.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">No featured content available yet.</div>
            <p className="text-sm text-gray-500">
              Check back later for lessons, presets, and gallery showcases.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}