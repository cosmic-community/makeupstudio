'use client'

import { useState, useEffect } from 'react'

interface LoadingStage {
  name: string
  duration: number
}

interface LoadingProgressProps {
  onComplete: () => void
  stages: LoadingStage[]
}

export default function LoadingProgress({ onComplete, stages }: LoadingProgressProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentStage >= stages.length) {
      // All stages complete
      setTimeout(() => {
        onComplete()
      }, 200)
      return
    }

    const stage = stages[currentStage]
    const startTime = Date.now()
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const stageProgress = Math.min((elapsed / stage.duration) * 100, 100)
      setProgress(stageProgress)

      if (stageProgress >= 100) {
        // Move to next stage
        setTimeout(() => {
          setCurrentStage(prev => prev + 1)
          setProgress(0)
        }, 100)
      } else {
        requestAnimationFrame(updateProgress)
      }
    }

    updateProgress()
  }, [currentStage, stages, onComplete])

  if (currentStage >= stages.length) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">✓</span>
          </div>
          <p className="text-white font-medium">Ready!</p>
        </div>
      </div>
    )
  }

  const currentStageName = stages[currentStage]?.name || 'Loading...'

  return (
    <div className="min-h-screen bg-studio-darker flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 bg-studio-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">Setting up your studio</h2>
        <p className="text-gray-400 mb-8">
          {currentStageName}
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-studio-gray rounded-full h-2 mb-4">
          <div 
            className="bg-studio-accent h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Stage Indicator */}
        <p className="text-sm text-gray-400">
          Step {currentStage + 1} of {stages.length}
        </p>
      </div>
    </div>
  )
}