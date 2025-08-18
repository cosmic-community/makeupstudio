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
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Handle video stream setup
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      setVideoReady(false)
    }
  }, [stream])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      setVideoReady(false)

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
    if (!videoRef.current || !canvasRef.current || !videoReady) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return

    setCapturing(true)

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0)

      // Convert canvas to blob with higher quality
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.95)
      })

      if (blob) {
        const file = new File([blob], `webcam-selfie-${Date.now()}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        })
        onPhotoSelected(file)
        stopCamera()
      }
    } catch (error) {
      console.error('Error taking photo:', error)
      setError('Failed to capture photo. Please try again.')
    } finally {
      setCapturing(false)
    }
  }, [onPhotoSelected, stopCamera, videoReady])

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