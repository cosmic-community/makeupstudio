'use client'

import { useState, useRef, useCallback } from 'react'

interface PhotoUploadProps {
  onPhotoSelected: (photo: File) => void
  selectedPhoto: File | null
}

export default function PhotoUpload({ onPhotoSelected, selectedPhoto }: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'That file type isn\'t supported. Please use JPG, PNG, or WebP.'
    }
    
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return 'That file is too large. Try a smaller image.'
    }
    
    return null
  }

  const handleFile = useCallback((file: File) => {
    setError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Check image dimensions
    const img = new Image()
    img.onload = () => {
      if (img.width < 800) {
        setError('Photo may be too small. Results can look blurry below 800px wide.')
      }
      onPhotoSelected(file)
    }
    img.src = URL.createObjectURL(file)
  }, [onPhotoSelected])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200 ${
          dragActive
            ? 'border-studio-accent bg-studio-accent/10'
            : 'border-studio-gray hover:border-studio-gray-light'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {selectedPhoto ? (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-2xl">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Photo Selected</h3>
              <p className="text-gray-400 text-sm">{selectedPhoto.name}</p>
              <p className="text-gray-400 text-xs">
                {(selectedPhoto.size / 1024 / 1024).toFixed(1)}MB
              </p>
            </div>
            <button 
              className="text-studio-accent hover:text-studio-accent-light text-sm"
              onClick={(e) => {
                e.stopPropagation()
                onPhotoSelected(null as any)
              }}
            >
              Choose Different Photo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-studio-gray rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-2xl">📸</span>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Drag a selfie here</h3>
              <p className="text-gray-400 text-sm">Or click to browse</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Remove glasses for better landmark detection.
        </p>
      </div>
    </div>
  )
}