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

export interface ColorPalette {
  id: string
  name: string
  colors: string[]
  category: 'skin' | 'eyes' | 'lips' | 'custom'
}