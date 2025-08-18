import Link from 'next/link'
import { getLookPresets, getColorPalettes } from '@/lib/cosmic'
import PresetCard from '@/components/PresetCard'
import Navigation from '@/components/Navigation'

export default async function PresetsPage() {
  const [presets, palettes] = await Promise.all([
    getLookPresets(),
    getColorPalettes()
  ])

  // Group presets by category
  const presetsByCategory = presets.reduce((acc, preset) => {
    const category = preset.metadata.category?.value || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(preset)
    return acc
  }, {} as Record<string, typeof presets>)

  return (
    <div className="min-h-screen bg-studio-darker">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Preset Looks</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Load a starting setup. You can tweak anything after.
          </p>
        </div>

        {presets.length > 0 ? (
          <div className="space-y-16">
            {Object.entries(presetsByCategory).map(([category, categoryPresets]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-white mb-8">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryPresets.map((preset) => (
                    <PresetCard key={preset.id} preset={preset} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-studio-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Presets Available</h3>
            <p className="text-gray-400 mb-6">
              Presets load here. Open the Presets tab to get started.
            </p>
            <Link 
              href="/new" 
              className="studio-button"
            >
              Create New Project
            </Link>
          </div>
        )}

        {/* Color Palettes Section */}
        {palettes.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-8">Color Palettes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {palettes.map((palette) => (
                <div 
                  key={palette.id} 
                  className="bg-studio-dark rounded-lg border border-studio-gray p-6"
                >
                  <h3 className="font-medium text-white mb-4">{palette.metadata.name}</h3>
                  
                  {/* Color Swatches */}
                  <div className="flex gap-2 mb-4">
                    {palette.metadata.swatches.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border border-studio-gray"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2">
                    {palette.metadata.category?.value}
                  </p>
                  
                  {palette.metadata.occasion && (
                    <p className="text-gray-300 text-sm">
                      Best for: {palette.metadata.occasion}
                    </p>
                  )}
                  
                  {palette.metadata.notes && (
                    <p className="text-gray-400 text-xs mt-3">
                      {palette.metadata.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Use Presets */}
        <div className="mt-20 bg-studio-dark rounded-lg border border-studio-gray p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use Presets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-studio-accent rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-medium text-white mb-2">Choose a Look</h3>
              <p className="text-gray-400 text-sm">
                Browse our curated presets and select one that matches your desired style.
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-studio-accent rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-medium text-white mb-2">Apply to Project</h3>
              <p className="text-gray-400 text-sm">
                The preset will automatically create layers with the right colors and settings.
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-studio-accent rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-medium text-white mb-2">Customize & Refine</h3>
              <p className="text-gray-400 text-sm">
                Adjust colors, opacity, and add your own touches to make it perfect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}