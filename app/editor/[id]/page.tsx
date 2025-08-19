// app/editor/[id]/page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MakeupEditor from '@/components/MakeupEditor'
import { getStoredPhoto, getStoredProject, storeProject } from '@/lib/storage'
import type { StoredPhoto, StoredProject } from '@/lib/storage'
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
        
        // Load photo data using the new storage system
        const storedPhoto = getStoredPhoto(id)
        
        if (!storedPhoto) {
          console.error('No photo data found for project:', id)
          setError('No photo found for this project. Please start a new project.')
          return
        }

        console.log('Photo data loaded successfully:', {
          id: storedPhoto.id,
          dimensions: `${storedPhoto.width}x${storedPhoto.height}`,
          size: `${(storedPhoto.dataUrl.length / 1024).toFixed(1)}KB`,
          source: storedPhoto.source
        })

        // Validate photo data
        if (!storedPhoto.dataUrl.startsWith('data:image/')) {
          console.error('Invalid photo data format')
          setError('Invalid photo data found. Please start a new project.')
          return
        }

        // Test image loading
        await new Promise<void>((resolve, reject) => {
          const testImg = new Image()
          testImg.onload = () => {
            console.log('Photo validation successful:', testImg.width, 'x', testImg.height)
            
            if (testImg.width === 0 || testImg.height === 0) {
              reject(new Error('Photo has invalid dimensions'))
              return
            }
            
            resolve()
          }
          testImg.onerror = () => {
            reject(new Error('Photo data is corrupted'))
          }
          testImg.src = storedPhoto.dataUrl
        })

        // Convert stored photo to Photo type for editor
        const photo: Photo = {
          id: storedPhoto.id,
          source: storedPhoto.source,
          blobRef: storedPhoto.dataUrl,
          width: storedPhoto.width,
          height: storedPhoto.height,
          capturedAt: storedPhoto.capturedAt,
          filename: storedPhoto.filename,
          size: storedPhoto.size,
          type: storedPhoto.type
        }
        
        setPhoto(photo)

        // Load or create project
        let projectData = getStoredProject(id)
        
        if (!projectData) {
          console.log('Creating new project for:', id)
          projectData = {
            id,
            title: 'Untitled Project',
            photoId: storedPhoto.id,
            layers: [],
            createdAt: new Date().toISOString(),
            symmetryGuide: false,
            exportSettings: {
              format: 'png',
              quality: 95,
              includeOriginal: true
            }
          }
          storeProject(projectData)
        }

        // Convert to Project type for editor
        const project: Project = {
          id: projectData.id,
          title: projectData.title,
          photoId: projectData.photoId,
          layers: projectData.layers,
          createdAt: projectData.createdAt,
          updatedAt: projectData.updatedAt,
          symmetryGuide: projectData.symmetryGuide,
          exportSettings: projectData.exportSettings
        }

        console.log('Project loaded successfully:', project.id)
        setProject(project)

      } catch (err) {
        console.error('Error loading project:', err)
        
        let errorMessage = 'Failed to load project. The photo data may be corrupted or missing.'
        
        if (err instanceof Error) {
          if (err.message.includes('corrupted')) {
            errorMessage = 'The photo data is corrupted. Please start a new project with a fresh photo.'
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
    console.log('Updating project:', updatedProject.id)
    setProject(updatedProject)
    
    // Convert to StoredProject and save
    const storedProject: StoredProject = {
      id: updatedProject.id,
      title: updatedProject.title,
      photoId: updatedProject.photoId,
      layers: updatedProject.layers,
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
      symmetryGuide: updatedProject.symmetryGuide,
      exportSettings: updatedProject.exportSettings
    }
    
    storeProject(storedProject)
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