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
        // Try to load existing project from localStorage
        const savedProject = localStorage.getItem(`project_${id}`)
        const photoData = localStorage.getItem(`photo_${id}`)
        
        if (!photoData) {
          setError('No photo found for this project')
          return
        }

        // Create photo object
        const newPhoto: Photo = {
          id: `photo_${id}`,
          source: 'upload',
          blobRef: photoData,
          width: 800,
          height: 600,
          capturedAt: new Date().toISOString()
        }
        setPhoto(newPhoto)

        // Load or create project
        if (savedProject) {
          const parsedProject = JSON.parse(savedProject) as Project
          setProject(parsedProject)
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
          setProject(newProject)
          localStorage.setItem(`project_${id}`, JSON.stringify(newProject))
        }
      } catch (err) {
        console.error('Error loading project:', err)
        setError('Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id])

  const handleProjectUpdate = (updatedProject: Project) => {
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
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Project</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={handleBack}
            className="studio-button"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!project || !photo) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-6">The project you're looking for doesn't exist.</p>
          <button 
            onClick={handleBack}
            className="studio-button"
          >
            Back to Home
          </button>
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