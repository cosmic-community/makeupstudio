import Link from 'next/link'

export default function Navigation() {
  return (
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
  )
}