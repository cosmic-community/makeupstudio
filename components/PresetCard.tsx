import Link from 'next/link'
import type { LookPreset } from '@/types'

interface PresetCardProps {
  preset: LookPreset
}

export default function PresetCard({ preset }: PresetCardProps) {
  return (
    <div className="preset-card">
      {preset.metadata.preview_image && (
        <div className="aspect-video mb-4">
          <img
            src={`${preset.metadata.preview_image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
            alt={preset.metadata.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-white font-medium mb-2">
              {preset.metadata.name}
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              {preset.metadata.description}
            </p>
          </div>
          {preset.metadata.popular && (
            <span className="bg-studio-accent px-2 py-1 rounded text-xs text-white">
              Popular
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-studio-gray px-2 py-1 rounded text-xs text-gray-300">
            {preset.metadata.category?.value || 'Classic'}
          </span>
          <span className="bg-studio-gray px-2 py-1 rounded text-xs text-gray-300">
            {preset.metadata.complexity?.value || 'Simple'}
          </span>
          <span className="text-gray-400 text-xs">
            {preset.metadata.layers.length} layers
          </span>
        </div>
        
        {/* Color Palette Preview */}
        {preset.metadata.color_palette?.metadata?.swatches && (
          <div className="flex gap-1 mb-4">
            {preset.metadata.color_palette.metadata.swatches.slice(0, 5).map((color: string, index: number) => (
              <div
                key={index}
                className="w-6 h-6 rounded border border-studio-gray"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
        
        <button className="studio-button w-full">
          Load Preset
        </button>
      </div>
    </div>
  )
}