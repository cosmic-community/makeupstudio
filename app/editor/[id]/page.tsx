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
          setError('No photo found for this project. Please start a new project.')
          return
        }

        // Validate the photo data URL
        if (!photoDataUrl.startsWith('data:image/')) {
          setError('Invalid photo data found. Please start a new project.')
          return
        }

        // Test if the image can be loaded
        await new Promise<void>((resolve, reject) => {
          const testImg = new Image()
          testImg.onload = () => {
            console.log('Photo data is valid, dimensions:', testImg.width, 'x', testImg.height)
            resolve()
          }
          testImg.onerror = () => {
            reject(new Error('Photo data is corrupted'))
          }
          testImg.src = photoDataUrl
        })

        // Parse photo metadata or create default
        let photoMetadata
        if (photoMetadataStr) {
          try {
            photoMetadata = JSON.parse(photoMetadataStr)
          } catch (parseError) {
            console.error('Error parsing photo metadata:', parseError)
            // Create default metadata
            photoMetadata = {
              id: `photo_${id}`,
              source: 'upload',
              filename: 'photo.jpg',
              size: 0,
              type: 'image/jpeg',
              capturedAt: new Date().toISOString(),
              width: 800,
              height: 600
            }
          }
        } else {
          // Create default metadata if none exists
          photoMetadata = {
            id: `photo_${id}`,
            source: 'upload',
            filename: 'photo.jpg',
            size: 0,
            type: 'image/jpeg',
            capturedAt: new Date().toISOString(),
            width: 800,
            height: 600
          }
        }

        // Get actual image dimensions from the data URL
        const img = new Image()
        await new Promise<void>((resolve) => {
          img.onload = () => {
            photoMetadata.width = img.width
            photoMetadata.height = img.height
            resolve()
          }
          img.src = photoDataUrl
        })

        // Create photo object with validated data
        const newPhoto: Photo = {
          id: photoMetadata.id || `photo_${id}`,
          source: photoMetadata.source || 'upload',
          blobRef: photoDataUrl, // This is the validated data URL
          width: photoMetadata.width,
          height: photoMetadata.height,
          capturedAt: photoMetadata.capturedAt || new Date().toISOString()
        }
        
        console.log('Created photo object:', newPhoto)
        setPhoto(newPhoto)

        // Try to load existing project from localStorage
        const savedProject = localStorage.getItem(`project_${id}`)
        if (savedProject) {
          try {
            const parsedProject = JSON.parse(savedProject) as Project
            console.log('Loaded existing project:', parsedProject)
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
        if (err instanceof Error && err.message === 'Photo data is corrupted') {
          setError('The photo data is corrupted or invalid. Please start a new project with a fresh photo.')
        } else {
          setError('Failed to load project. The photo data may be corrupted or missing.')
        }
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