'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoUpload from '@/components/PhotoUpload'
import WebcamCapture from '@/components/WebcamCapture'
import { storePhoto, storeProject, checkStorageQuota } from '@/lib/storage'
import type { StoredProject } from '@/lib/storage'

export default function NewProjectPage() {
  const router = useRouter()
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePhotoSelected = (photo: File | null) => {
    console.log('Photo selected:', photo?.name, photo?.size)
    setSelectedPhoto(photo)
    setError(null)
  }

  const handleContinue = async () => {
    if (!selectedPhoto) {
      setError('Please select a photo first')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      console.log('Starting photo processing for editor:', selectedPhoto.name)
      
      // Check storage quota before proceeding
      const storageCheck = checkStorageQuota()
      if (!storageCheck.available) {
        throw new Error('Browser storage is full. Please clear some space and try again.')
      }

      // Generate unique project ID
      const projectId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('Generated project ID:', projectId)

      // Store photo data with comprehensive validation
      const storedPhoto = await storePhoto(projectId, selectedPhoto, activeTab)
      console.log('Photo stored successfully:', storedPhoto.id)

      // Create initial project data
      const newProject: StoredProject = {
        id: projectId,
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

      // Store project data
      storeProject(newProject)
      console.log('Project created and stored:', newProject.id)

      // Navigate to editor
      console.log('Navigating to editor with project ID:', projectId)
      router.push(`/editor/${projectId}`)

    } catch (error) {
      console.error('Error processing photo:', error)
      
      let errorMessage = 'Failed to process photo. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('storage')) {
          errorMessage = 'Browser storage is full. Please clear some data and try again.'
        } else if (error.message.includes('quota')) {
          errorMessage = 'Storage quota exceeded. Please free up some space.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-studio-darker">
      {/* Header */}
      <div className="border-b border-studio-gray">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
            <h1 className="text-2xl font-bold text-white">Start New Project</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex mb-8 bg-studio-dark rounded-lg p-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-studio-accent text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Upload Photo
            </button>
            <button
              onClick={() => setActiveTab('webcam')}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'webcam'
                  ? 'bg-studio-accent text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Take Photo
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === 'upload' ? (
              <PhotoUpload 
                onPhotoSelected={handlePhotoSelected}
                selectedPhoto={selectedPhoto}
              />
            ) : (
              <WebcamCapture 
                onPhotoSelected={handlePhotoSelected}
                selectedPhoto={selectedPhoto}
              />
            )}
          </div>

          {/* Continue Button */}
          {selectedPhoto && (
            <div className="text-center">
              <button
                onClick={handleContinue}
                disabled={isProcessing}
                className={`studio-button text-lg px-8 py-4 ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Processing Photo...
                  </span>
                ) : (
                  'Continue to Editor'
                )}
              </button>
              <p className="text-gray-400 text-sm mt-3">
                Your photo will be stored locally and not uploaded to any server.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="mt-12 p-6 bg-studio-dark rounded-lg border border-studio-gray">
            <h3 className="text-white font-medium mb-3">Tips for Best Results</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Use even, bright lighting from the front</li>
              <li>• Keep hair off your face and remove glasses</li>
              <li>• Look directly at the camera with a neutral expression</li>
              <li>• Make sure your face fills most of the frame</li>
              <li>• Use a photo that's at least 800px wide for better quality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}