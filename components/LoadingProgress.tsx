'use client'

import { useState, useEffect } from 'react'

interface LoadingProgressProps {
  onComplete: () => void
  stages?: Array<{ name: string; duration: number }>
}

export default function LoadingProgress({ 
  onComplete,
  stages = [
    { name: "Loading photo...", duration: 1000 },
    { name: "Initializing canvas...", duration: 800 },
    { name: "Setting up tools...", duration: 600 },
    { name: "Preparing workspace...", duration: 400 },
    { name: "Almost ready...", duration: 300 }
  ]
}: LoadingProgressProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentStageName, setCurrentStageName] = useState(stages[0]?.name || "Loading...")

  useEffect(() => {
    let progressTimer: NodeJS.Timeout
    let stageTimer: NodeJS.Timeout | undefined = undefined
    
    const totalDuration = stages.reduce((total, stage) => total + stage.duration, 0)
    let elapsedTime = 0
    
    const updateProgress = () => {
      const increment = 100 / (totalDuration / 50) // Update every 50ms
      
      progressTimer = setInterval(() => {
        elapsedTime += 50
        const newProgress = Math.min((elapsedTime / totalDuration) * 100, 100)
        setProgress(newProgress)
        
        // Update stage based on elapsed time
        let cumulativeTime = 0
        let newStageIndex = 0
        
        for (let i = 0; i < stages.length; i++) {
          cumulativeTime += stages[i].duration
          if (elapsedTime < cumulativeTime) {
            newStageIndex = i
            break
          }
          newStageIndex = i + 1
        }
        
        // Fix: Add proper bounds checking and null safety
        if (newStageIndex !== currentStage && newStageIndex < stages.length && stages[newStageIndex]) {
          setCurrentStage(newStageIndex)
          setCurrentStageName(stages[newStageIndex].name)
        }
        
        // Complete when progress reaches 100%
        if (newProgress >= 100) {
          clearInterval(progressTimer)
          setTimeout(() => {
            onComplete()
          }, 200)
        }
      }, 50)
    }
    
    updateProgress()
    
    return () => {
      if (progressTimer) clearInterval(progressTimer)
      if (stageTimer) clearTimeout(stageTimer)
    }
  }, [onComplete, stages, currentStage])

  return (
    <div className="min-h-screen bg-studio-darker flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo/Icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-studio-accent rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
            <span className="text-white font-bold text-2xl z-10">🎨</span>
            {/* Animated background */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-30 transition-transform duration-300"
              style={{
                transform: `translateX(${-100 + progress}%)`
              }}
            />
          </div>
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-2 border-studio-accent opacity-20 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-studio-accent opacity-40 animate-pulse" />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-studio-gray rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-studio-accent to-pink-500 rounded-full transition-all duration-200 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />
            </div>
          </div>
          
          {/* Percentage */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{currentStageName}</span>
            <span className="text-white font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-center space-x-2 mb-6">
          {stages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStage
                  ? 'bg-studio-accent scale-110'
                  : index === currentStage + 1
                  ? 'bg-studio-accent/50 animate-pulse'
                  : 'bg-studio-gray'
              }`}
            />
          ))}
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Setting up your studio</h3>
          <p className="text-gray-400 text-sm">
            Preparing your makeup editor with all the tools you need
          </p>
        </div>

        {/* Fun loading messages that change based on progress */}
        <div className="mt-6 h-6">
          {progress < 25 && (
            <p className="text-xs text-gray-500 animate-fade-in">
              💡 Tip: Good lighting makes a huge difference in makeup photos
            </p>
          )}
          {progress >= 25 && progress < 50 && (
            <p className="text-xs text-gray-500 animate-fade-in">
              🎨 Did you know? You can sample colors directly from your photo
            </p>
          )}
          {progress >= 50 && progress < 75 && (
            <p className="text-xs text-gray-500 animate-fade-in">
              ✨ Pro tip: Use light, buildable strokes for natural-looking makeup
            </p>
          )}
          {progress >= 75 && (
            <p className="text-xs text-gray-500 animate-fade-in">
              🚀 Almost there! Get ready to create something amazing
            </p>
          )}
        </div>
      </div>
    </div>
  )
}