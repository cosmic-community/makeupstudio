'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PhotoUpload from '@/components/PhotoUpload'
import WebcamCapture from '@/components/WebcamCapture'

type TabType = 'upload' | 'webcam'

export default function NewProjectPage() {
  const [activeTab, setActiveTab] = useState<TabType>('upload')
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const router = useRouter()

  const handlePhotoSelected = (photo: File) => {
    setSelectedPhoto(photo)
  }

  const handleContinue = async () => {
    if (!selectedPhoto) return
    
    // Create a new project ID
    const projectId = `project_${Date.now()}`
    
    // Store photo in IndexedDB (simplified for demo)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        localStorage.setItem(`photo_${projectId}`, reader.result as string)
        router.push(`/editor/${projectId}`)
      } catch (error) {
        console.error('Error storing photo:', error)
      }
    }
    reader.readAsDataURL(selectedPhoto)
  }

  return (
    <div className="min-h-screen bg-studio-darker">
      {/* Navigation */}
      <nav className="border-b border-studio-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-studio-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-white">MakeupStudio</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Choose your photo</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload a selfie or capture one with your webcam to start practicing makeup techniques. 
            For best results, use good lighting and face the camera directly.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-studio-dark rounded-lg p-1 border border-studio-gray">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'upload'
                  ? 'bg-studio-accent text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab('webcam')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'webcam'
                  ? 'bg-studio-accent text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Webcam
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-studio-dark rounded-lg border border-studio-gray p-8">
          {activeTab === 'upload' && (
            <div>
              <div className="text-center mb-6">
                <p className="text-gray-400">JPG, PNG, or WebP. Minimum 800px wide.</p>
              </div>
              <PhotoUpload 
                onPhotoSelected={handlePhotoSelected}
                selectedPhoto={selectedPhoto}
              />
            </div>
          )}
          
          {activeTab === 'webcam' && (
            <div>
              <div className="text-center mb-6">
                <p className="text-gray-400">Good lighting, face centered, neutral expression.</p>
              </div>
              <WebcamCapture 
                onPhotoSelected={handlePhotoSelected}
                selectedPhoto={selectedPhoto}
              />
            </div>
          )}
        </div>

        {/* Continue Button */}
        {selectedPhoto && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleContinue}
              className="studio-button text-lg px-8 py-3"
            >
              Continue to Editor
            </button>
          </div>
        )}

        {/* Helper Tips */}
        <div className="mt-12 p-6 bg-studio-dark rounded-lg border border-studio-gray">
          <h3 className="text-white font-medium mb-4">Tips for best results:</h3>
          <ul className="space-y-2 text-gray-400">
            <li>• Remove glasses for better landmark detection</li>
            <li>• Use even lighting - avoid harsh shadows</li>
            <li>• Face the camera directly with a neutral expression</li>
            <li>• Keep hair away from your face</li>
            <li>• Minimum 800px width for crisp results</li>
          </ul>
        </div>
      </div>
    </div>
  )
}