import Link from 'next/link'

export default function QuickStart() {
  const steps = [
    {
      step: '1',
      title: 'Upload Photo',
      description: 'Choose a selfie or capture with webcam',
      icon: '📸'
    },
    {
      step: '2', 
      title: 'Face Detection',
      description: 'AI maps your facial features automatically',
      icon: '🎯'
    },
    {
      step: '3',
      title: 'Practice Makeup',
      description: 'Use realistic brushes with professional blend modes',
      icon: '🎨'
    },
    {
      step: '4',
      title: 'Export Results',
      description: 'Save before/after images and look recipes',
      icon: '💾'
    }
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get started in minutes with our simple workflow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-studio-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-studio-accent-light rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{step.step}</span>
                </div>
              </div>
              <h3 className="text-white font-medium mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/new"
            className="studio-button text-lg px-8 py-4"
          >
            Try It Now
          </Link>
        </div>
      </div>
    </section>
  )
}