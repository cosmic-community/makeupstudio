export interface StoredPhoto {
  id: string
  source: 'upload' | 'webcam'
  dataUrl: string
  width: number
  height: number
  capturedAt: string
  filename: string
  size: number
  type: string
  lastModified?: number
}

export interface StoredProject {
  id: string
  title: string
  photoId: string
  layers: any[]
  createdAt: string
  updatedAt?: string
  symmetryGuide: boolean
  exportSettings?: {
    format: 'png' | 'jpg'
    quality: number
    includeOriginal: boolean
  }
}

// Photo storage functions
export function storePhoto(projectId: string, photo: File, source: 'upload' | 'webcam'): Promise<StoredPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string
        
        if (!dataUrl || !dataUrl.startsWith('data:image/')) {
          throw new Error('Invalid image data format')
        }

        // Get image dimensions
        const dimensions = await getImageDimensions(dataUrl)
        
        const storedPhoto: StoredPhoto = {
          id: `photo_${projectId}`,
          source,
          dataUrl,
          width: dimensions.width,
          height: dimensions.height,
          capturedAt: new Date().toISOString(),
          filename: photo.name,
          size: photo.size,
          type: photo.type,
          lastModified: photo.lastModified
        }

        // Store in localStorage with error handling
        try {
          localStorage.setItem(`photo_${projectId}`, JSON.stringify(storedPhoto))
          
          // Verify storage
          const stored = localStorage.getItem(`photo_${projectId}`)
          if (!stored) {
            throw new Error('Failed to store photo data')
          }

          console.log('Photo stored successfully:', storedPhoto.id)
          resolve(storedPhoto)
        } catch (storageError) {
          console.error('localStorage error:', storageError)
          throw new Error('Storage quota exceeded or localStorage unavailable')
        }
      } catch (error) {
        console.error('Error processing photo:', error)
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(photo)
  })
}

export function getStoredPhoto(projectId: string): StoredPhoto | null {
  try {
    const stored = localStorage.getItem(`photo_${projectId}`)
    if (!stored) {
      console.log('No stored photo found for project:', projectId)
      return null
    }

    const photo = JSON.parse(stored) as StoredPhoto
    
    // Validate stored photo data
    if (!photo.dataUrl || !photo.dataUrl.startsWith('data:image/')) {
      console.error('Invalid stored photo data format')
      return null
    }

    return photo
  } catch (error) {
    console.error('Error loading stored photo:', error)
    return null
  }
}

export function deleteStoredPhoto(projectId: string): void {
  try {
    localStorage.removeItem(`photo_${projectId}`)
    console.log('Photo deleted for project:', projectId)
  } catch (error) {
    console.error('Error deleting photo:', error)
  }
}

// Project storage functions
export function storeProject(project: StoredProject): void {
  try {
    const projectData = {
      ...project,
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(`project_${project.id}`, JSON.stringify(projectData))
    console.log('Project stored:', project.id)
  } catch (error) {
    console.error('Error storing project:', error)
    throw new Error('Failed to save project')
  }
}

export function getStoredProject(projectId: string): StoredProject | null {
  try {
    const stored = localStorage.getItem(`project_${projectId}`)
    if (!stored) {
      return null
    }
    
    return JSON.parse(stored) as StoredProject
  } catch (error) {
    console.error('Error loading project:', error)
    return null
  }
}

export function deleteStoredProject(projectId: string): void {
  try {
    localStorage.removeItem(`project_${projectId}`)
    deleteStoredPhoto(projectId)
    console.log('Project and photo deleted:', projectId)
  } catch (error) {
    console.error('Error deleting project:', error)
  }
}

// Get all stored projects (for future project list feature)
export function getAllStoredProjects(): StoredProject[] {
  const projects: StoredProject[] = []
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('project_')) {
        const stored = localStorage.getItem(key)
        if (stored) {
          try {
            const project = JSON.parse(stored) as StoredProject
            projects.push(project)
          } catch (parseError) {
            console.error('Error parsing project:', key, parseError)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading projects:', error)
  }
  
  return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Utility function to get image dimensions
function getImageDimensions(dataUrl: string): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      if (img.width === 0 || img.height === 0) {
        reject(new Error('Invalid image dimensions'))
      } else {
        resolve({
          width: img.width,
          height: img.height
        })
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = dataUrl
  })
}

// Storage quota check
export function checkStorageQuota(): {available: boolean, usage?: number} {
  try {
    // Estimate usage
    let totalSize = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const item = localStorage.getItem(key)
        if (item) {
          totalSize += item.length
        }
      }
    }
    
    // Try to store a test item
    const testKey = 'storage_test'
    const testData = 'test'
    localStorage.setItem(testKey, testData)
    localStorage.removeItem(testKey)
    
    return {
      available: true,
      usage: totalSize
    }
  } catch (error) {
    return {
      available: false
    }
  }
}