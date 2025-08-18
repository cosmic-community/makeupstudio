'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [showBeforeAfter, setShowBeforeAfter] = useState(false)
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser' | 'dropper'>('brush')
  const [isLoading, setIsLoading] = useState(true)
  const [calibrationNeeded, setCalibrationNeeded] = useState(true)

  // Load photo and initialize canvas
  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const img = new Image()
        img.onload = () => {
          const canvas = canvasRef.current
          if (!canvas) return

          const ctx = canvas.getContext('2d')
          if (!ctx) return

          // Set canvas size
          canvas.width = img.width
          canvas.height = img.height

          // Draw the photo
          ctx.drawImage(img, 0, 0)
          
          setIsLoading(false)
        }
        img.src = photo.blobRef
      } catch (error) {
        console.error('Error loading photo:', error)
      }
    }

    loadPhoto()
  }, [photo])

  const handleRunDetection = () => {
    setCalibrationNeeded(false)
    // In a real implementation, this would trigger face detection
    console.log('Running face detection...')
  }

  const handleSkipDetection = () => {
    setCalibrationNeeded(false)
  }

  const handleTitleChange = (newTitle: string) => {
    const updatedProject = { ...project, title: newTitle }
    onProjectUpdate(updatedProject)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-studio-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
            <span className="text-white font-bold text-xl">🎨</span>
          </div>
          <p className="text-white">Loading your photo...</p>
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
          <div className="canvas-container max-w-4xl w-full">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            {project.layers.length === 0 && !calibrationNeeded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <p className="text-white text-center">
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
      {calibrationNeeded && (
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