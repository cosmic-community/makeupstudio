export default function FeatureGrid() {
  const features = [
    {
      icon: '🤖',
      title: 'AI Face Detection',
      description: '468-point facial landmark detection for precise makeup application',
      highlight: true
    },
    {
      icon: '🖌️',
      title: 'Realistic Brushes',
      description: 'Professional brush engine with pressure, hardness, and blend modes'
    },
    {
      icon: '🎭',
      title: 'Region Masking',
      description: 'Smart masks keep strokes within facial regions like lips and eyes'
    },
    {
      icon: '📚',
      title: 'Interactive Lessons',
      description: 'Step-by-step tutorials with live overlays teaching techniques'
    },
    {
      icon: '🎨',
      title: 'Look Presets',
      description: 'Pre-configured makeup looks that can be applied and customized'
    },
    {
      icon: '⚖️',
      title: 'Symmetry Mode',
      description: 'Mirror brush strokes across the face for even application'
    },
    {
      icon: '🎯',
      title: 'Color Sampling',
      description: 'Eyedropper tool to sample natural skin tones from photos'
    },
    {
      icon: '📱',
      title: 'PWA Ready',
      description: 'Install as native app with offline functionality'
    }
  ]

  return (
    <section className="py-20 border-t border-studio-gray">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need for professional makeup practice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-studio-dark rounded-lg border p-6 transition-all duration-300 hover:border-studio-gray-light ${
                feature.highlight 
                  ? 'border-studio-accent bg-gradient-to-br from-studio-dark to-studio-accent/10' 
                  : 'border-studio-gray hover:border-studio-gray-light'
              }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}