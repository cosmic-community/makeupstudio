'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoUpload from '@/components/PhotoUpload'
import WebcamCapture from '@/components/WebcamCapture'

export default function NewProjectPage() {
  const router = useRouter()
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePhotoSelected = (photo: File | null) => {
    console.log('Photo selected:', photo)
    setSelectedPhoto(photo)
  }

  const handleContinue = async () => {
    if (!selectedPhoto) {
      console.error('No photo selected')
      return
    }

    setIsProcessing(true)

    try {
      console.log('Processing photo for editor:', selectedPhoto.name, selectedPhoto.size, 'bytes')
      
      // Generate unique project ID
      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('Generated project ID:', projectId)

      // Convert File to data URL with error handling
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result
          if (typeof result === 'string') {
            resolve(result)
          } else {
            reject(new Error('Failed to read file as data URL'))
          }
        }
        reader.onerror = () => reject(new Error('FileReader error'))
        reader.readAsDataURL(selectedPhoto)
      })

      console.log('Data URL created, length:', dataUrl.length)

      // Validate the data URL
      if (!dataUrl.startsWith('data:image/')) {
        throw new Error('Invalid image data URL format')
      }

      // Get image dimensions for complete metadata
      const imageMetadata = await new Promise<{width: number, height: number}>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          console.log('Image loaded for metadata, dimensions:', img.width, 'x', img.height)
          resolve({
            width: img.width,
            height: img.height
          })
        }
        img.onerror = () => reject(new Error('Failed to load image for metadata'))
        img.src = dataUrl
      })

      // Create comprehensive photo metadata
      const photoMetadata = {
        id: `photo_${projectId}`,
        source: activeTab, // 'upload' or 'webcam'
        filename: selectedPhoto.name,
        size: selectedPhoto.size,
        type: selectedPhoto.type,
        capturedAt: new Date().toISOString(),
        width: imageMetadata.width,
        height: imageMetadata.height,
        lastModified: selectedPhoto.lastModified
      }

      console.log('Created photo metadata:', photoMetadata)

      // Store photo data and metadata in localStorage with validation
      try {
        localStorage.setItem(`photo_${projectId}`, dataUrl)
        localStorage.setItem(`photo_metadata_${projectId}`, JSON.stringify(photoMetadata))
        
        // Verify storage was successful
        const storedData = localStorage.getItem(`photo_${projectId}`)
        const storedMetadata = localStorage.getItem(`photo_metadata_${projectId}`)
        
        if (!storedData || !storedMetadata) {
          throw new Error('Failed to store photo data in localStorage')
        }
        
        console.log('Photo data stored successfully in localStorage')
        console.log('Stored data length:', storedData.length)
        console.log('Stored metadata:', JSON.parse(storedMetadata))
        
      } catch (storageError) {
        console.error('localStorage storage error:', storageError)
        throw new Error('Failed to save photo data. Your browser may be running low on storage space.')
      }

      // Navigate to editor with the project ID
      console.log('Navigating to editor with project ID:', projectId)
      router.push(`/editor/${projectId}`)

    } catch (error) {
      console.error('Error processing photo:', error)
      alert(error instanceof Error ? error.message : 'Failed to process photo. Please try again.')
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
                {isProcessing ? 'Processing...' : 'Continue to Editor'}
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