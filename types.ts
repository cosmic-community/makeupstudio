export interface Photo {
  id: string
  source: 'upload' | 'webcam'
  blobRef: string // data URL for the image
  width: number
  height: number
  capturedAt: string // ISO date string
  filename?: string // original filename
  size?: number // file size in bytes
  type?: string // MIME type
}

export interface Layer {
  id: string
  type: 'foundation' | 'concealer' | 'contour' | 'blush' | 'highlight' | 'eyeshadow' | 'eyeliner' | 'eyebrow' | 'mascara' | 'lipstick' | 'custom'
  name: string
  visible: boolean
  opacity: number
  blendMode: 'normal' | 'multiply' | 'overlay' | 'soft-light' | 'color-burn' | 'color-dodge'
  color: string
  strokes: Stroke[]
  createdAt: string
}

export interface Stroke {
  id: string
  points: Point[]
  color: string
  size: number
  opacity: number
  tool: 'brush' | 'eraser'
  timestamp: number
}

export interface Point {
  x: number
  y: number
  pressure?: number
}

export interface Project {
  id: string
  title: string
  photoId: string
  layers: Layer[]
  createdAt: string
  updatedAt?: string
  symmetryGuide: boolean
  exportSettings?: {
    format: 'png' | 'jpg'
    quality: number
    includeOriginal: boolean
  }
}

export interface BrushSettings {
  size: number
  opacity: number
  softness: number
  color: string
  tool: 'brush' | 'eraser' | 'dropper'
}

// Base Cosmic object interface
export interface CosmicObject {
  id: string
  slug: string
  title: string
  created_at: string
  modified_at: string
  status: string
  thumbnail?: string
}

// Color Palette with proper Cosmic structure
export interface ColorPalette extends CosmicObject {
  metadata: {
    name: string
    swatches: string[]
    category?: {
      key: string
      value: string
    }
    occasion?: string
    notes?: string
  }
}

// Look Preset with proper Cosmic structure
export interface LookPreset extends CosmicObject {
  metadata: {
    name: string
    description: string
    category?: {
      key: string
      value: string
    }
    complexity?: {
      key: string
      value: string
    }
    popular?: boolean
    preview_image?: {
      imgix_url: string
      url: string
    }
    layers: Array<{
      type: string
      color: string
      opacity: number
    }>
    color_palette?: {
      metadata: {
        swatches: string[]
      }
    }
  }
}

// Lesson with proper Cosmic structure
export interface Lesson extends CosmicObject {
  metadata: {
    title: string
    description: string
    difficulty?: {
      key: string
      value: string
    }
    skill?: {
      key: string
      value: string
    }
    duration_minutes?: number
    featured?: boolean
    preview_image?: {
      imgix_url: string
      url: string
    }
  }
}

// Tips & Guides
export interface TipGuide extends CosmicObject {
  metadata: {
    title: string
    content: string
    category?: string
    difficulty?: string
    is_quick_tip?: boolean
  }
}

// Gallery Showcase
export interface GalleryShowcase extends CosmicObject {
  metadata: {
    title: string
    description: string
    featured_images?: Array<{
      imgix_url: string
      url: string
    }>
    techniques?: string[]
    homepage_featured?: boolean
  }
}

// User Project
export interface UserProject extends CosmicObject {
  metadata: {
    title: string
    description?: string
    project_data: string // JSON string of the project
    tags?: string[]
    is_public?: boolean
  }
}

// Generic Cosmic Response
export interface CosmicResponse<T = CosmicObject> {
  objects: T[]
  total: number
  limit: number
}