// app/editor/[id]/page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MakeupEditor from '@/components/MakeupEditor'
import type { Project, Photo } from '@/types'

interface EditorPageProps {
  params: Promise<{ id: string }>
}

export default function EditorPage({ params }: EditorPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      try {
        console.log('Loading project for ID:', id)
        
        // Try to load photo data from localStorage
        const photoDataUrl = localStorage.getItem(`photo_${id}`)
        const photoMetadataStr = localStorage.getItem(`photo_metadata_${id}`)
        
        console.log('Photo data found:', !!photoDataUrl)
        console.log('Photo metadata found:', !!photoMetadataStr)
        
        if (!photoDataUrl) {
          console.error('No photo data found in localStorage for project:', id)
          setError('No photo found for this project. Please start a new project.')
          return
        }

        // Validate the photo data URL format
        if (!photoDataUrl.startsWith('data:image/')) {
          console.error('Invalid photo data format:', photoDataUrl.substring(0, 50))
          setError('Invalid photo data found. Please start a new project.')
          return
        }

        console.log('Photo data URL length:', photoDataUrl.length)
        console.log('Photo data preview:', photoDataUrl.substring(0, 100) + '...')

        // Test if the image data can be loaded
        await new Promise<void>((resolve, reject) => {
          const testImg = new Image()
          testImg.onload = () => {
            console.log('Photo data validation successful, dimensions:', testImg.width, 'x', testImg.height)
            
            if (testImg.width === 0 || testImg.height === 0) {
              reject(new Error('Photo has invalid dimensions'))
              return
            }
            
            resolve()
          }
          testImg.onerror = (error) => {
            console.error('Photo data validation failed:', error)
            reject(new Error('Photo data is corrupted or invalid'))
          }
          testImg.src = photoDataUrl
        })

        // Parse photo metadata with fallback
        let photoMetadata: any = {}
        if (photoMetadataStr) {
          try {
            photoMetadata = JSON.parse(photoMetadataStr)
            console.log('Parsed photo metadata:', photoMetadata)
          } catch (parseError) {
            console.error('Error parsing photo metadata:', parseError)
            console.log('Using default metadata instead')
          }
        }

        // Get actual image dimensions from the data URL to ensure accuracy
        const actualDimensions = await new Promise<{width: number, height: number}>((resolve) => {
          const img = new Image()
          img.onload = () => {
            resolve({
              width: img.width,
              height: img.height
            })
          }
          img.src = photoDataUrl
        })

        console.log('Actual image dimensions from data URL:', actualDimensions)

        // Create comprehensive photo object with all required data
        const newPhoto: Photo = {
          id: photoMetadata.id || `photo_${id}`,
          source: photoMetadata.source || 'upload',
          blobRef: photoDataUrl, // The validated data URL
          width: actualDimensions.width,
          height: actualDimensions.height,
          capturedAt: photoMetadata.capturedAt || new Date().toISOString(),
          // Additional metadata for editor
          filename: photoMetadata.filename || 'photo.jpg',
          size: photoMetadata.size || photoDataUrl.length,
          type: photoMetadata.type || 'image/jpeg'
        }
        
        console.log('Created comprehensive photo object:', newPhoto)
        setPhoto(newPhoto)

        // Try to load existing project from localStorage
        const savedProject = localStorage.getItem(`project_${id}`)
        if (savedProject) {
          try {
            const parsedProject = JSON.parse(savedProject) as Project
            console.log('Loaded existing project:', parsedProject)
            
            // Ensure the project has the correct photo ID
            if (parsedProject.photoId !== newPhoto.id) {
              parsedProject.photoId = newPhoto.id
              localStorage.setItem(`project_${id}`, JSON.stringify(parsedProject))
            }
            
            setProject(parsedProject)
          } catch (parseError) {
            console.error('Error parsing saved project:', parseError)
            // Create new project if parsing fails
            const newProject: Project = {
              id,
              title: 'Untitled Project',
              createdAt: new Date().toISOString(),
              photoId: newPhoto.id,
              layers: [],
              symmetryGuide: false
            }
            setProject(newProject)
            localStorage.setItem(`project_${id}`, JSON.stringify(newProject))
          }
        } else {
          // Create new project
          const newProject: Project = {
            id,
            title: 'Untitled Project',
            createdAt: new Date().toISOString(),
            photoId: newPhoto.id,
            layers: [],
            symmetryGuide: false
          }
          console.log('Created new project:', newProject)
          setProject(newProject)
          localStorage.setItem(`project_${id}`, JSON.stringify(newProject))
        }
      } catch (err) {
        console.error('Error loading project:', err)
        
        let errorMessage = 'Failed to load project. The photo data may be corrupted or missing.'
        
        if (err instanceof Error) {
          if (err.message.includes('corrupted') || err.message.includes('invalid')) {
            errorMessage = 'The photo data is corrupted or invalid. Please start a new project with a fresh photo.'
          } else if (err.message.includes('dimensions')) {
            errorMessage = 'The photo has invalid dimensions. Please start a new project with a valid image.'
          }
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProject()
    }
  }, [id])

  const handleProjectUpdate = (updatedProject: Project) => {
    console.log('Updating project:', updatedProject)
    setProject(updatedProject)
    localStorage.setItem(`project_${id}`, JSON.stringify(updatedProject))
  }

  const handleBack = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-studio-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-white">Loading your project...</p>
          <p className="text-gray-400 text-sm mt-2">Validating photo data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Project</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleBack}
              className="studio-button"
            >
              Back to Home
            </button>
            <button 
              onClick={() => router.push('/new')}
              className="studio-button-secondary"
            >
              Start New Project
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!project || !photo) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-6">
            The project you're looking for doesn't exist or the data is corrupted.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleBack}
              className="studio-button"
            >
              Back to Home
            </button>
            <button 
              onClick={() => router.push('/new')}
              className="studio-button-secondary"
            >
              Start New Project
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <MakeupEditor 
      project={project}
      photo={photo}
      onProjectUpdate={handleProjectUpdate}
      onBack={handleBack}
    />
  )
}