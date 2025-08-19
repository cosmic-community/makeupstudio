'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface WebcamCaptureProps {
  onPhotoSelected: (photo: File) => void
  selectedPhoto: File | null
}

export default function WebcamCapture({ onPhotoSelected, selectedPhoto }: WebcamCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Handle video stream setup
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      setVideoReady(false)
    }
  }, [stream])

  // Clean up stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      setVideoReady(false)
      setCapturedPhoto(null)

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser')
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      })
      
      setStream(mediaStream)
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      console.error('Camera access error:', err)
      
      let errorMessage = 'Unable to access camera. Please check your browser settings.'
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.'
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.'
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported by this browser.'
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application.'
      }
      
      setError(errorMessage)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setVideoReady(false)
    }
  }, [stream])

  const handleVideoReady = useCallback(() => {
    setVideoReady(true)
  }, [])

  const takePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !videoReady) {
      console.error('Video or canvas not ready')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) {
      console.error('Could not get canvas context')
      return
    }

    setCapturing(true)

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      console.log('Taking photo, video dimensions:', video.videoWidth, 'x', video.videoHeight)

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0)

      // Convert canvas to blob with higher quality
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => {
          resolve(result)
        }, 'image/jpeg', 0.95)
      })

      if (!blob) {
        throw new Error('Failed to create image blob')
      }

      console.log('Photo blob created, size:', blob.size, 'bytes')

      // Create file from blob with proper metadata
      const timestamp = Date.now()
      const file = new File([blob], `webcam-selfie-${timestamp}.jpg`, { 
        type: 'image/jpeg',
        lastModified: timestamp
      })

      console.log('Photo file created:', file.name, file.size, 'bytes')

      // Verify the file can be read
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          console.log('Photo file verification successful')
          setCapturedPhoto(file)
          onPhotoSelected(file)
          stopCamera()
        } else {
          console.error('Photo file verification failed')
          throw new Error('Photo file verification failed')
        }
      }
      reader.onerror = () => {
        console.error('Photo file read error')
        throw new Error('Photo file read error')
      }
      reader.readAsDataURL(file)

    } catch (error) {
      console.error('Error taking photo:', error)
      setError('Failed to capture photo. Please try again.')
    } finally {
      setCapturing(false)
    }
  }, [onPhotoSelected, stopCamera, videoReady])

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null)
    onPhotoSelected(null as any)
    startCamera()
  }, [onPhotoSelected, startCamera])

  // Show success state when photo is captured
  if (capturedPhoto || (selectedPhoto && !stream)) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
          <span className="text-white text-2xl">✓</span>
        </div>
        <div>
          <h3 className="text-white font-medium mb-1">Photo Captured Successfully</h3>
          <p className="text-gray-400 text-sm">
            {capturedPhoto ? capturedPhoto.name : selectedPhoto?.name} 
            {capturedPhoto && ` (${(capturedPhoto.size / 1024 / 1024).toFixed(1)}MB)`}
          </p>
          <p className="text-gray-400 text-sm mt-1">Ready to continue to editor</p>
        </div>
        <button 
          onClick={retakePhoto}
          className="studio-button-secondary"
        >
          Retake Photo
        </button>
      </div>
    )
  }

  // Show camera interface when streaming
  if (stream) {
    return (
      <div className="space-y-6">
        <div className="relative bg-studio-darker rounded-lg overflow-hidden">
          {(loading || capturing) && (
            <div className="absolute inset-0 bg-studio-darker bg-opacity-75 flex items-center justify-center z-10">
              <div className="text-white">
                {capturing ? 'Capturing photo...' : 'Loading camera...'}
              </div>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={handleVideoReady}
            onCanPlay={handleVideoReady}
            className="w-full h-auto"
            style={{ display: videoReady ? 'block' : 'none' }}
          />
          {!videoReady && !loading && !capturing && (
            <div className="w-full h-64 bg-studio-darker flex items-center justify-center">
              <div className="text-gray-400">Initializing camera...</div>
            </div>
          )}
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
              disabled={!videoReady || capturing}
              className={`studio-button ${(!videoReady || capturing) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {capturing ? 'Capturing...' : 'Take Photo'}
            </button>
            <button
              onClick={stopCamera}
              disabled={capturing}
              className="studio-button-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show initial state with start camera button
  return (
    <div className="space-y-6 text-center">
      {error ? (
        <div className="space-y-4">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white text-2xl">!</span>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Camera Access Issue</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">{error}</p>
          </div>
          <button 
            onClick={startCamera}
            disabled={loading}
            className={`studio-button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Starting...' : 'Try Again'}
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
            disabled={loading}
            className={`studio-button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Starting Camera...' : 'Start Camera'}
          </button>
        </div>
      )}
    </div>
  )
}