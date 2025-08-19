'use client'

import { useState, useRef, useCallback } from 'react'

interface PhotoUploadProps {
  onPhotoSelected: (photo: File | null) => void
  selectedPhoto: File | null
}

export default function PhotoUpload({ onPhotoSelected, selectedPhoto }: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      return 'That file type isn\'t supported. Please use JPG, PNG, or WebP.'
    }
    
    // Check file size (15MB max to be more generous)
    if (file.size > 15 * 1024 * 1024) {
      return 'That file is too large. Try a smaller image (max 15MB).'
    }
    
    // Check minimum file size (avoid corrupted files)
    if (file.size < 1024) {
      return 'File appears to be corrupted or too small.'
    }
    
    return null
  }

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    
    console.log('Processing uploaded file:', file.name, file.size, 'bytes', file.type)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      // Create preview URL for display
      const previewDataUrl = URL.createObjectURL(file)
      setPreviewUrl(previewDataUrl)

      // Check image dimensions and validate the file can be loaded
      const img = new Image()
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height)
          
          if (img.width === 0 || img.height === 0) {
            reject(new Error('Invalid image dimensions'))
            return
          }
          
          if (img.width < 400 || img.height < 400) {
            setError('Photo may be too small for good results. Try using an image at least 400x400 pixels.')
          } else if (img.width < 800) {
            setError('Photo may produce blurry results. For best quality, use images 800px wide or larger.')
          }
          
          resolve()
        }
        
        img.onerror = () => {
          reject(new Error('Failed to load image file'))
        }
        
        img.src = previewDataUrl
      })

      console.log('File validation successful, calling onPhotoSelected')
      onPhotoSelected(file)

    } catch (error) {
      console.error('Error processing file:', error)
      setError('Failed to process the image file. Please try a different photo.')
      
      // Clean up preview URL on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    }
  }, [onPhotoSelected, previewUrl])

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

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Removing selected photo')
    
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    setError(null)
    onPhotoSelected(null)
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
          accept="image/jpeg,image/jpg,image/png,image/webp"
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
                {(selectedPhoto.size / 1024 / 1024).toFixed(1)}MB • {selectedPhoto.type}
              </p>
            </div>
            <button 
              className="text-studio-accent hover:text-studio-accent-light text-sm"
              onClick={handleRemovePhoto}
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
              <p className="text-gray-400 text-xs mt-2">
                Supports JPG, PNG, WebP up to 15MB
              </p>
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