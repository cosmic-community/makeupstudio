'use client'

import { useState, useRef, useCallback } from 'react'

interface WebcamCaptureProps {
  onPhotoSelected: (photo: File) => void
  selectedPhoto: File | null
}

export default function WebcamCapture({ onPhotoSelected, selectedPhoto }: WebcamCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setError('Camera access is blocked in your browser settings.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0)

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'webcam-selfie.jpg', { type: 'image/jpeg' })
        onPhotoSelected(file)
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }, [onPhotoSelected, stopCamera])

  const retakePhoto = useCallback(() => {
    onPhotoSelected(null as any)
    startCamera()
  }, [onPhotoSelected, startCamera])

  if (selectedPhoto && !stream) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
          <span className="text-white text-2xl">✓</span>
        </div>
        <div>
          <h3 className="text-white font-medium mb-1">Photo Captured</h3>
          <p className="text-gray-400 text-sm">Ready to continue to editor</p>
        </div>
        <button 
          onClick={retakePhoto}
          className="studio-button-secondary"
        >
          Retake
        </button>
      </div>
    )
  }

  if (stream && videoRef.current) {
    return (
      <div className="space-y-6">
        <div className="relative bg-studio-darker rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">
            Face the camera. Even lighting. Keep hair off the face.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={takePhoto}
              className="studio-button"
            >
              Take Photo
            </button>
            <button
              onClick={stopCamera}
              className="studio-button-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-center">
      {error ? (
        <div className="space-y-4">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white text-2xl">!</span>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Camera Access Blocked</h3>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
          <button 
            onClick={startCamera}
            className="studio-button"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-20 h-20 bg-studio-gray rounded-full flex items-center justify-center mx-auto">
            <span className="text-white text-2xl">📹</span>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Allow camera access to capture a selfie</h3>
            <p className="text-gray-400 text-sm">
              We'll use your camera to take a photo for makeup practice
            </p>
          </div>
          <button 
            onClick={startCamera}
            className="studio-button"
          >
            Start Camera
          </button>
        </div>
      )}
    </div>
  )
}