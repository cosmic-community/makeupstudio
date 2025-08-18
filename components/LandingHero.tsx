import Link from 'next/link'

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow">
            Practice makeup on your own photo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Try techniques, refine looks, and compare before/after—right in your browser.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/new"
              className="studio-button text-lg px-8 py-4"
            >
              Start a New Project
            </Link>
            <Link 
              href="/presets"
              className="text-studio-accent hover:text-studio-accent-light transition-colors duration-200 font-medium"
            >
              See Presets →
            </Link>
          </div>
        </div>
        
        {/* Hero Image Preview */}
        <div className="mt-16">
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-studio-dark rounded-lg border border-studio-gray p-8 glass-effect">
              <div className="aspect-video bg-studio-darker rounded-lg border border-studio-gray-light flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-studio-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-3xl">🎨</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">Professional Makeup Editor</h3>
                  <p className="text-gray-400">Upload your photo to see the interface</p>
                </div>
              </div>
            </div>
            
            {/* Floating UI Elements */}
            <div className="absolute -left-4 top-16 bg-studio-dark rounded-lg border border-studio-gray p-3 glass-effect">
              <div className="flex flex-col gap-2">
                <div className="w-8 h-8 bg-studio-accent rounded tool-button"></div>
                <div className="w-8 h-8 bg-studio-gray rounded tool-button"></div>
                <div className="w-8 h-8 bg-studio-gray rounded tool-button"></div>
              </div>
            </div>
            
            <div className="absolute -right-4 top-20 bg-studio-dark rounded-lg border border-studio-gray p-3 glass-effect">
              <div className="text-xs text-gray-400 mb-2">Layers</div>
              <div className="space-y-1">
                <div className="w-24 h-4 bg-studio-gray rounded"></div>
                <div className="w-24 h-4 bg-studio-gray rounded"></div>
                <div className="w-24 h-4 bg-studio-accent rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-studio-accent/20 via-transparent to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_50%)]"></div>
      </div>
    </section>
  )
}