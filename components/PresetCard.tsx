import { LookPreset } from '@/types'

interface PresetCardProps {
  preset: LookPreset
}

export default function PresetCard({ preset }: PresetCardProps) {
  const complexityColors = {
    'Simple': 'text-green-400',
    'Moderate': 'text-yellow-400', 
    'Complex': 'text-red-400'
  }

  const complexityValue = preset.metadata?.complexity?.value
  const complexityColor = complexityValue ? complexityColors[complexityValue as keyof typeof complexityColors] || 'text-gray-400' : 'text-gray-400'

  return (
    <div className="bg-studio-gray rounded-lg overflow-hidden hover:bg-studio-gray-light transition-all duration-300 hover:transform hover:scale-105">
      {preset.metadata?.preview_image?.imgix_url && (
        <div className="aspect-square overflow-hidden">
          <img 
            src={`${preset.metadata.preview_image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
            alt={preset.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {preset.metadata?.complexity?.value && (
            <span className={`text-xs font-medium px-2 py-1 rounded ${complexityColor} bg-current bg-opacity-20`}>
              {preset.metadata.complexity.value}
            </span>
          )}
          {preset.metadata?.popular && (
            <span className="text-yellow-400 text-xs">
              ⭐ Popular
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {preset.metadata?.name || preset.title}
        </h3>
        
        {preset.metadata?.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {preset.metadata.description}
          </p>
        )}

        {/* Color Preview */}
        {preset.metadata?.color_palette?.metadata?.swatches && (
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {preset.metadata.color_palette.metadata.swatches.slice(0, 5).map((color: string, index: number) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-600 flex-shrink-0"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {preset.metadata.color_palette.metadata.swatches.length} colors
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {preset.metadata?.category?.value && (
            <span className="text-studio-accent text-sm font-medium">
              {preset.metadata.category.value}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}