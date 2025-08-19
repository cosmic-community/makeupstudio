'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import LoadingProgress from './LoadingProgress'
import type { Project, Photo, Layer } from '@/types'

interface MakeupEditorProps {
  project: Project
  photo: Photo
  onProjectUpdate: (project: Project) => void
  onBack: () => void
}

export default function MakeupEditor({ 
  project, 
  photo, 
  onProjectUpdate, 
  onBack 
}: MakeupEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [showBeforeAfter, setShowBeforeAfter] = useState(false)
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser' | 'dropper'>('brush')
  const [isLoading, setIsLoading] = useState(true)
  const [calibrationNeeded, setCalibrationNeeded] = useState(true)
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const [canvasInitialized, setCanvasInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize canvas and load photo
  const initializeCanvas = useCallback(async () => {
    if (!photo?.blobRef || !canvasRef.current) {
      console.error('Missing photo blobRef or canvas ref')
      setError('Photo data is missing')
      return false
    }

    console.log('Initializing canvas with photo data')
    
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        console.error('Could not get canvas context')
        setError('Canvas not supported')
        return false
      }

      // Validate photo data
      if (!photo.blobRef.startsWith('data:image/')) {
        console.error('Invalid photo data format')
        setError('Invalid photo format')
        return false
      }

      // Create and load image
      const img = new Image()
      
      return new Promise<boolean>((resolve) => {
        img.onload = () => {
          try {
            console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height)
            
            // Validate image dimensions
            if (img.width === 0 || img.height === 0) {
              console.error('Image has invalid dimensions')
              setError('Image has invalid dimensions')
              resolve(false)
              return
            }
            
            // Set canvas size to match image
            canvas.width = img.width
            canvas.height = img.height
            
            // Clear canvas and draw image
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
            
            // Store reference to the image
            if (imageRef.current) {
              imageRef.current.src = photo.blobRef
            }
            
            console.log('Canvas initialized successfully')
            setPhotoLoaded(true)
            setCanvasInitialized(true)
            setError(null)
            resolve(true)
          } catch (error) {
            console.error('Error drawing image to canvas:', error)
            setError('Failed to display image')
            resolve(false)
          }
        }
        
        img.onerror = (error) => {
          console.error('Error loading image:', error)
          setError('Failed to load image data')
          resolve(false)
        }
        
        // Set image source to trigger load
        img.src = photo.blobRef
      })
    } catch (error) {
      console.error('Error in initializeCanvas:', error)
      setError('Failed to initialize canvas')
      return false
    }
  }, [photo])

  // Handle loading completion
  const handleLoadingComplete = useCallback(async () => {
    console.log('Loading progress completed, initializing canvas...')
    
    try {
      const success = await initializeCanvas()
      console.log('Canvas initialization result:', success)
      
      if (success) {
        // Small delay to ensure everything is ready
        setTimeout(() => {
          setIsLoading(false)
          console.log('Editor ready')
        }, 300)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Failed to initialize canvas:', error)
      setError('Failed to initialize editor')
      setIsLoading(false)
    }
  }, [initializeCanvas])

  const handleRunDetection = () => {
    setCalibrationNeeded(false)
    console.log('Running face detection...')
  }

  const handleSkipDetection = () => {
    setCalibrationNeeded(false)
  }

  const handleTitleChange = (newTitle: string) => {
    const updatedProject = { ...project, title: newTitle }
    onProjectUpdate(updatedProject)
  }

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <LoadingProgress 
        onComplete={handleLoadingComplete}
        stages={[
          { name: "Loading your photo...", duration: 1000 },
          { name: "Initializing canvas...", duration: 800 },
          { name: "Setting up drawing tools...", duration: 600 },
          { name: "Preparing color palette...", duration: 500 },
          { name: "Loading brush presets...", duration: 400 },
          { name: "Final touches...", duration: 300 }
        ]}
      />
    )
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Editor Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={onBack}
              className="studio-button"
            >
              Back to Home
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="studio-button-secondary"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-studio-darker">
      {/* Top Bar */}
      <div className="border-b border-studio-gray">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <input
              type="text"
              value={project.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-transparent text-white text-lg font-medium border-none outline-none"
              placeholder="Untitled Project"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBeforeAfter(!showBeforeAfter)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                showBeforeAfter
                  ? 'bg-studio-accent text-white'
                  : 'bg-studio-gray text-gray-300 hover:bg-studio-gray-light'
              }`}
            >
              Before/After
            </button>
            <button className="studio-button">
              Export
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Help
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Toolbox */}
        <div className="w-64 border-r border-studio-gray p-6 space-y-6">
          <div className="toolbar-panel">
            <h3 className="text-white font-medium mb-4">Tools</h3>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentTool('brush')}
                className={`tool-button w-full justify-start gap-3 ${
                  currentTool === 'brush' ? 'active' : ''
                }`}
              >
                <span>🖌️</span>
                <span className="text-sm">Brush</span>
              </button>
              <button
                onClick={() => setCurrentTool('eraser')}
                className={`tool-button w-full justify-start gap-3 ${
                  currentTool === 'eraser' ? 'active' : ''
                }`}
              >
                <span>🧹</span>
                <span className="text-sm">Eraser</span>
              </button>
              <button
                onClick={() => setCurrentTool('dropper')}
                className={`tool-button w-full justify-start gap-3 ${
                  currentTool === 'dropper' ? 'active' : ''
                }`}
              >
                <span>💧</span>
                <span className="text-sm">Dropper</span>
              </button>
            </div>
          </div>

          <div className="toolbar-panel">
            <h3 className="text-white font-medium mb-4">Brush Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Size</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  defaultValue="40"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="80"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Softness/Edge</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="toolbar-panel">
            <h3 className="text-white font-medium mb-4">Color</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2">
                {['#f3d3be', '#e7a2a0', '#c97f75', '#7a4f3a', '#4a3f48', '#c8192f'].map((color) => (
                  <button
                    key={color}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400">Click the photo to sample.</p>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="canvas-container max-w-4xl w-full relative">
            {canvasInitialized && photoLoaded ? (
              <>
                {/* Hidden image element for reference */}
                <img
                  ref={imageRef}
                  className="hidden"
                  alt="Source photo"
                />
                {/* Main canvas */}
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain max-w-full max-h-full border border-studio-gray rounded-lg"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 'calc(100vh - 8rem)',
                    display: 'block',
                    background: '#1a1a1a'
                  }}
                />
              </>
            ) : (
              <div className="w-full h-96 bg-studio-dark rounded-lg flex items-center justify-center border border-studio-gray">
                <div className="text-center">
                  <div className="w-12 h-12 bg-studio-accent rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-soft">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <p className="text-gray-400">Preparing canvas...</p>
                </div>
              </div>
            )}
            
            {project.layers.length === 0 && !calibrationNeeded && canvasInitialized && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg pointer-events-none">
                <p className="text-white text-center max-w-xs">
                  Select a tool and start painting. Masks keep strokes inside each region.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Layer Panel */}
        <div className="w-64 border-l border-studio-gray p-6">
          <div className="toolbar-panel">
            <h3 className="text-white font-medium mb-4">Layers</h3>
            {project.layers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm mb-4">
                  No layers yet. Add one to begin.
                </p>
                <select className="blend-mode-select w-full mb-2">
                  <option>Foundation</option>
                  <option>Concealer</option>
                  <option>Contour</option>
                  <option>Blush</option>
                  <option>Highlight</option>
                  <option>Eyeshadow</option>
                  <option>Eyeliner</option>
                  <option>Eyebrow</option>
                  <option>Mascara</option>
                  <option>Lipstick</option>
                  <option>Custom Layer</option>
                </select>
                <button className="studio-button w-full text-sm">
                  Add Layer
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {project.layers.map((layer) => (
                  <div key={layer.id} className="layer-item">
                    <button className="text-xs">👁️</button>
                    <span className="text-sm text-white flex-1">{layer.type}</span>
                    <button className="text-xs">⋮</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calibration Overlay */}
      {calibrationNeeded && canvasInitialized && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-studio-dark rounded-lg border border-studio-gray p-8 max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Let's map your features</h2>
            <p className="text-gray-300 mb-6">
              We'll detect facial landmarks to guide brushes and masks. If detection looks off, 
              try a brighter photo or recapture.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleRunDetection}
                className="studio-button flex-1"
              >
                Run Detection
              </button>
              <button 
                onClick={handleSkipDetection}
                className="studio-button-secondary flex-1"
              >
                Skip
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              You can run detection later from the Help menu.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}