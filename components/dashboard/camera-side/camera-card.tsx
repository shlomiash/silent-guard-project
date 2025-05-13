'use client'

import { useRef, useEffect } from 'react'
import { useCameraStream } from '@/components/dashboard/camera-side/hook/useCameraStream'
import { AlertTriangle, X, Maximize, Minimize } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Camera {
  id: string
  name: string
  url: string
  category: string
}

interface Props {
  camera: Camera
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onDanger: () => void
  showAlert: boolean
  dismissAlert: () => void
}

export default function CameraCard({
  camera,
  isFullscreen,
  onToggleFullscreen,
  onDanger,
  showAlert,
  dismissAlert,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useCameraStream({
    url: camera.url,
    canvasRef,
    onMetadata: () => {
      onDanger()
      // audioRef.current?.play().catch(() => {})
    },
  })

  // עוצר את האזעקה כש־showAlert הופך ל־false
  useEffect(() => {
    if (!showAlert && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [showAlert])

  return (
    <div
  className={`relative rounded overflow-hidden border ${isFullscreen ? 'h-[60vh]' : ''}`}
>
<canvas
  ref={canvasRef}
  className="w-full h-full object-contain"
/>
      <audio ref={audioRef} src="/alarm-sound.mp3" loop />

      <div className="absolute top-2 left-2 flex items-center justify-between w-full px-2">
        <div className="bg-black/50 text-white text-sm px-2 py-1 rounded">{camera.name}</div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 text-white"
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      {showAlert && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white p-2 animate-pulse flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          סכנה!
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissAlert}
            className="ml-auto text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
