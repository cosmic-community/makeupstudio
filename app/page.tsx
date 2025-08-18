import Link from 'next/link'
import { getFeaturedLessons, getPopularLookPresets, getFeaturedGallery } from '@/lib/cosmic'
import LandingHero from '@/components/LandingHero'
import FeatureGrid from '@/components/FeatureGrid'
import QuickStart from '@/components/QuickStart'
import FeaturedContent from '@/components/FeaturedContent'
import TrustBar from '@/components/TrustBar'

export default async function HomePage() {
  // Fetch featured content
  const [featuredLessons, popularPresets, featuredGallery] = await Promise.all([
    getFeaturedLessons(),
    getPopularLookPresets(), 
    getFeaturedGallery()
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-studio-darker via-studio-dark to-studio-darker">
      {/* Navigation */}
      <nav className="border-b border-studio-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-studio-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-white">MakeupStudio</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link 
                href="/presets" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Presets
              </Link>
              <Link 
                href="/lessons" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Lessons
              </Link>
              <Link 
                href="/help" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Help
              </Link>
              <Link 
                href="/new" 
                className="studio-button"
              >
                New Project
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <LandingHero />

      {/* Trust Bar */}
      <TrustBar />

      {/* Quick Start */}
      <QuickStart />

      {/* Features Grid */}
      <FeatureGrid />

      {/* Featured Content */}
      <FeaturedContent 
        lessons={featuredLessons}
        presets={popularPresets}
        gallery={featuredGallery}
      />

      {/* Footer */}
      <footer className="border-t border-studio-gray mt-24">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-studio-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-white">MakeupStudio</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Practice makeup techniques on your own photos with realistic brushes and AI-powered face detection. 
                Privacy-first. No account required.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Photo Upload</li>
                <li>Webcam Capture</li>
                <li>Face Detection</li>
                <li>Realistic Brushes</li>
                <li>Export Tools</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Learn</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/lessons" className="hover:text-white transition-colors">Lessons</Link></li>
                <li><Link href="/presets" className="hover:text-white transition-colors">Presets</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help & Tips</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-studio-gray mt-12 pt-8">
            <p className="text-center text-gray-400 text-sm">
              Your photo stays on your device unless you create a share link.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}