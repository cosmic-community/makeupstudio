import { getLookPresets, getColorPalettes } from '@/lib/cosmic'
import PresetCard from '@/components/PresetCard'
import { LookPreset, ColorPalette } from '@/types'

export default async function PresetsPage() {
  const [lookPresets, colorPalettes] = await Promise.all([
    getLookPresets(),
    getColorPalettes()
  ])

  // Group presets by category
  const categoryPresets = lookPresets.reduce((acc: Record<string, LookPreset[]>, preset) => {
    const category = preset.metadata?.category?.value || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(preset)
    return acc
  }, {})

  // Group color palettes by category  
  const categoryPalettes = colorPalettes.reduce((acc: Record<string, ColorPalette[]>, palette) => {
    const category = palette.metadata?.category?.value || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(palette)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-studio-darker text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Makeup Presets</h1>
          <p className="text-gray-400 text-lg">
            Professional looks and color palettes to inspire your creativity
          </p>
        </div>

        {/* Look Presets */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Look Presets</h2>
          {Object.entries(categoryPresets).map(([category, presets]) => (
            <div key={category} className="mb-12">
              <h3 className="text-xl font-medium text-studio-accent mb-6">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {presets.map((preset) => (
                  <PresetCard key={preset.id} preset={preset} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Color Palettes */}
        <div>
          <h2 className="text-2xl font-semibold mb-8">Color Palettes</h2>
          {Object.entries(categoryPalettes).map(([category, palettes]) => (
            <div key={category} className="mb-12">
              <h3 className="text-xl font-medium text-studio-accent mb-6">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {palettes.map((palette) => (
                  <div key={palette.id} className="bg-studio-gray rounded-lg p-6 hover:bg-studio-gray-light transition-colors">
                    <h4 className="text-lg font-medium mb-4">{palette.metadata?.name || palette.title}</h4>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {palette.metadata?.swatches?.map((color: string, index: number) => (
                        <div
                          key={index}
                          className="w-full h-12 rounded-md border border-gray-600"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      )) || []}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{palette.metadata?.category?.value || 'General'}</span>
                      <span>{palette.metadata?.swatches?.length || 0} colors</span>
                    </div>
                    {palette.metadata?.occasion && (
                      <div className="mt-2 text-xs text-studio-accent">
                        {palette.metadata.occasion}
                      </div>
                    )}
                    {palette.metadata?.notes && (
                      <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                        {palette.metadata.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {(Object.keys(categoryPresets).length === 0 && Object.keys(categoryPalettes).length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No presets or palettes available yet.</div>
            <p className="text-sm text-gray-500">
              Check back later for new makeup looks and color combinations.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}