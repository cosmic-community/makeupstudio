export default function TrustBar() {
  const features = [
    {
      icon: '🔒',
      text: 'Runs in your browser',
      description: 'No server uploads'
    },
    {
      icon: '📱',
      text: 'Your photo stays on your device', 
      description: 'Complete privacy'
    },
    {
      icon: '📤',
      text: 'Export when you\'re ready',
      description: 'High-quality results'
    }
  ]

  return (
    <section className="py-16 border-b border-studio-gray">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-medium mb-2">{feature.text}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Privacy-first. No account required.
          </p>
        </div>
      </div>
    </section>
  )
}