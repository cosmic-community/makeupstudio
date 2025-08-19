'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import WebcamCapture from '@/components/WebcamCapture'
import PhotoUpload from '@/components/PhotoUpload'

export default function NewProjectPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoMethod, setPhotoMethod] = useState<'webcam' | 'upload'>('webcam')
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handlePhotoSelected = useCallback(async (photo: File | null) => {
    if (!photo) {
      setSelectedPhoto(null)
      return
    }

    console.log('Photo selected:', photo.name, photo.size, 'bytes')
    setSelectedPhoto(photo)
  }, [])

  const handleContinue = useCallback(async () => {
    if (!selectedPhoto) {
      console.error('No photo selected')
      return
    }

    console.log('Processing photo for editor...')
    setIsProcessing(true)

    try {
      // Generate unique project ID
      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('Generated project ID:', projectId)
      
      // Convert file to data URL for storage
      const reader = new FileReader()
      
      const processPhoto = new Promise<void>((resolve, reject) => {
        reader.onload = async (e) => {
          if (e.target?.result) {
            try {
              const photoDataUrl = e.target.result as string
              console.log('Photo converted to data URL, length:', photoDataUrl.length)
              
              // Validate the data URL format
              if (!photoDataUrl.startsWith('data:image/')) {
                throw new Error('Invalid photo data format')
              }
              
              // Test if the image can be loaded
              const testImage = new Image()
              testImage.onload = () => {
                console.log('Photo validation successful, dimensions:', testImage.width, 'x', testImage.height)
                
                try {
                  // Store photo data in localStorage with error handling
                  localStorage.setItem(`photo_${projectId}`, photoDataUrl)
                  console.log('Photo data stored successfully')
                  
                  // Store photo metadata
                  const photoMetadata = {
                    id: `photo_${projectId}`,
                    source: photoMethod,
                    filename: selectedPhoto.name,
                    size: selectedPhoto.size,
                    type: selectedPhoto.type,
                    capturedAt: new Date().toISOString(),
                    width: testImage.width,
                    height: testImage.height
                  }
                  
                  localStorage.setItem(`photo_metadata_${projectId}`, JSON.stringify(photoMetadata))
                  console.log('Photo metadata stored:', photoMetadata)
                  
                  // Verify storage was successful
                  const storedPhoto = localStorage.getItem(`photo_${projectId}`)
                  const storedMetadata = localStorage.getItem(`photo_metadata_${projectId}`)
                  
                  if (!storedPhoto || !storedMetadata) {
                    throw new Error('Failed to verify photo storage')
                  }
                  
                  console.log('Photo storage verified successfully')
                  resolve()
                } catch (storageError) {
                  console.error('Storage error:', storageError)
                  reject(new Error('Failed to save photo data'))
                }
              }
              
              testImage.onerror = () => {
                console.error('Photo validation failed - image cannot be loaded')
                reject(new Error('Invalid photo data'))
              }
              
              testImage.src = photoDataUrl
            } catch (error) {
              console.error('Error processing photo:', error)
              reject(error)
            }
          } else {
            console.error('FileReader result is null')
            reject(new Error('Failed to read photo file'))
          }
        }
        
        reader.onerror = (error) => {
          console.error('FileReader error:', error)
          reject(new Error('Failed to process photo file'))
        }
        
        // Start reading the file
        reader.readAsDataURL(selectedPhoto)
      })
      
      // Wait for photo processing to complete
      await processPhoto
      
      // Navigate to editor
      console.log('Navigating to editor:', `/editor/${projectId}`)
      router.push(`/editor/${projectId}`)
      
    } catch (error) {
      console.error('Error in handleContinue:', error)
      alert(`Failed to process photo: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsProcessing(false)
    }
  }, [selectedPhoto, photoMethod, router])

  return (
    <div className="min-h-screen bg-studio-darker">
      {/* Header */}
      <div className="border-b border-studio-gray">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-white">New Project</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Add a Photo</h2>
          <p className="text-gray-400">
            Upload an existing selfie or take a new one with your camera
          </p>
        </div>

        {/* Photo Method Tabs */}
        <div className="flex bg-studio-dark rounded-lg p-1 mb-8">
          <button
            onClick={() => {
              setPhotoMethod('webcam')
              setSelectedPhoto(null)
            }}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              photoMethod === 'webcam'
                ? 'bg-studio-gray text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📹 Use Camera
          </button>
          <button
            onClick={() => {
              setPhotoMethod('upload')
              setSelectedPhoto(null)
            }}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              photoMethod === 'upload'
                ? 'bg-studio-gray text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📁 Upload Photo
          </button>
        </div>

        {/* Photo Capture/Upload */}
        <div className="bg-studio-dark rounded-lg p-8 mb-8">
          {photoMethod === 'webcam' ? (
            <WebcamCapture 
              onPhotoSelected={handlePhotoSelected}
              selectedPhoto={selectedPhoto}
            />
          ) : (
            <PhotoUpload 
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
            <p className="text-gray-400 text-sm mt-2">
              Your photo will be saved for the editor
            </p>
          </div>
        )}
      </div>
    </div>
  )
}