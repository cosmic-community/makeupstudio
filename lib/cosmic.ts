import { createBucketClient } from '@cosmicjs/sdk'
import type { 
  LookPreset, 
  ColorPalette, 
  Lesson, 
  TipGuide, 
  GalleryShowcase, 
  UserProject,
  CosmicResponse
} from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Look Presets
export async function getLookPresets(): Promise<LookPreset[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'look-presets' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as LookPreset[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching look presets:', error)
    throw new Error('Failed to fetch look presets')
  }
}

export async function getPopularLookPresets(): Promise<LookPreset[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'look-presets',
        'metadata.popular': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(6)
    
    return response.objects as LookPreset[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching popular presets:', error)
    throw new Error('Failed to fetch popular presets')
  }
}

export async function getLookPreset(slug: string): Promise<LookPreset | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'look-presets', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object as LookPreset
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching look preset:', error)
    throw new Error('Failed to fetch look preset')
  }
}

// Color Palettes
export async function getColorPalettes(category?: string): Promise<ColorPalette[]> {
  try {
    const query: any = { type: 'color-palettes' }
    if (category) {
      query['metadata.category'] = category
    }
    
    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects as ColorPalette[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching color palettes:', error)
    throw new Error('Failed to fetch color palettes')
  }
}

export async function getColorPalette(slug: string): Promise<ColorPalette | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'color-palettes', slug })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.object as ColorPalette
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching color palette:', error)
    throw new Error('Failed to fetch color palette')
  }
}

// Lessons
export async function getLessons(): Promise<Lesson[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'lessons' })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('metadata.difficulty')
      
    return response.objects as Lesson[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching lessons:', error)
    throw new Error('Failed to fetch lessons')
  }
}

export async function getFeaturedLessons(): Promise<Lesson[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'lessons',
        'metadata.featured': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .limit(4)
      
    return response.objects as Lesson[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching featured lessons:', error)
    throw new Error('Failed to fetch featured lessons')
  }
}

export async function getLesson(slug: string): Promise<Lesson | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'lessons', slug })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.object as Lesson
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching lesson:', error)
    throw new Error('Failed to fetch lesson')
  }
}

// Tips & Guides
export async function getTipsGuides(category?: string): Promise<TipGuide[]> {
  try {
    const query: any = { type: 'tips-guides' }
    if (category) {
      query['metadata.category'] = category
    }
    
    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('metadata.difficulty')
    
    return response.objects as TipGuide[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching tips and guides:', error)
    throw new Error('Failed to fetch tips and guides')
  }
}

export async function getQuickTips(): Promise<TipGuide[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'tips-guides',
        'metadata.is_quick_tip': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .limit(6)
    
    return response.objects as TipGuide[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching quick tips:', error)
    throw new Error('Failed to fetch quick tips')
  }
}

// Gallery Showcases
export async function getGalleryShowcases(): Promise<GalleryShowcase[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'gallery-showcases' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as GalleryShowcase[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching gallery showcases:', error)
    throw new Error('Failed to fetch gallery showcases')
  }
}

export async function getFeaturedGallery(): Promise<GalleryShowcase[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'gallery-showcases',
        'metadata.homepage_featured': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(3)
    
    return response.objects as GalleryShowcase[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching featured gallery:', error)
    throw new Error('Failed to fetch featured gallery')
  }
}

// User Projects (for potential future use)
export async function getUserProjects(): Promise<UserProject[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'user-projects' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as UserProject[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching user projects:', error)
    throw new Error('Failed to fetch user projects')
  }
}