"use client"

import { useState, useRef, useEffect } from "react"
import { Maximize, Minimize, MoreVertical, AlertTriangle, BellRing, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CameraStream from "./camera-stream"

interface Camera {
  id: number
  name: string
  status: "online" | "offline"
  streamUrl: string | null
  username?: string
  password?: string
}

interface Alert {
  cameraId: number
  message: string
  timestamp: Date
}

export default function CameraGrid() {

  // Here ill be the cameras from DB
  const [cameras, setCameras] = useState<Camera[]>([
    { id: 1, name: "BILLY", status: "online", streamUrl: 'http://192.168.90.59:5000/video', username: 'admin', password: '1234' },
    // { id: 2, name: "BOM", status: "online", streamUrl: 'http://192.168.90.124:5000/video', username: 'admin', password: '1234' },
    // { id: 3, name: "Guy Shower", status: "online", streamUrl: 'http://192.168.90.108:5000/video', username: 'admin', password: '1234' },
    // { id: 4, name: "blue", status: "online", streamUrl: 'http://192.168.90.65:5000/video', username: 'admin', password: '1234' },
  ])

  const [fullscreenCamera, setFullscreenCamera] = useState<number | null>(null)
  const [alertMode, setAlertMode] = useState<boolean>(false)
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [cameraMetadata, setCameraMetadata] = useState<Record<number, 'safe' | 'danger' | 'unknown'>>({});
  
  // Handle metadata changes from camera streams
  const handleMetadataChange = (cameraId: number, metadata: 'safe' | 'danger' | 'unknown') => {
    setCameraMetadata(prev => ({
      ...prev,
      [cameraId]: metadata
    }));
    
    // Automatically trigger an alert if metadata is 'danger'
    if (metadata === 'danger' && !alertMode) {
      const camera = cameras.find(c => c.id === cameraId);
      if (camera) {
        triggerAlert(cameraId, "Potential Drowning Detected");
      }
    }
  }

  // Calculate grid columns based on number of cameras
  const getGridCols = () => {
    if (fullscreenCamera !== null) return "grid-cols-1"

    const count = cameras.length
    if (count <= 1) return "grid-cols-1"
    if (count <= 4) return "grid-cols-2"
    if (count <= 9) return "grid-cols-3"
    return "grid-cols-4"
  }

  const toggleFullscreen = (cameraId: number) => {
    if (fullscreenCamera === cameraId) {
      setFullscreenCamera(null)
    } else {
      setFullscreenCamera(cameraId)
    }
  }

  const triggerAlert = (cameraId: number, message: string) => {
    setAlertMode(true)
    setActiveAlert({
      cameraId,
      message,
      timestamp: new Date(),
    })
  
    // Try playing the sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => {
        console.warn("Audio play failed:", err)
      })
    }
  }

  const dismissAlert = () => {
    setAlertMode(false)
    setActiveAlert(null)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }



  return (
    <div className="h-full flex flex-col p-12">
      <audio ref={audioRef} src="/alarm-sound.mp3" loop />
      <div className="flex-1 p-4 overflow-auto">
        <div className={`grid ${getGridCols()} gap-4 auto-rows-fr h-full`}>
          {cameras
            .filter((camera) => fullscreenCamera === null || camera.id === fullscreenCamera)
            .map((camera) => (
              <div
                key={camera.id}
                className={`relative rounded-lg overflow-hidden border ${
                  alertMode && activeAlert?.cameraId === camera.id
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-800"
                } bg-slate-50 dark:bg-slate-900`}
              >
                {camera.status === "online" && camera.streamUrl ? (
                  <div className="absolute inset-0">
                    <CameraStream
                      cameraUrl={camera.streamUrl}
                      username={camera.username}
                      password={camera.password}
                      onMetadataChange={(metadata) => handleMetadataChange(camera.id, metadata)}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-800">
                    <div className="h-20 w-20 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center mb-4">
                      <AlertTriangle className="h-10 w-10 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">NO CAMERA</div>
                    <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">STREAM</div>
                  </div>
                )}

                <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-center">
                  <span className="text-white font-medium">{camera.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-black/30 text-white hover:bg-black/50"
                      onClick={() => toggleFullscreen(camera.id)}
                    >
                      {fullscreenCamera === camera.id ? (
                        <Minimize className="h-4 w-4" />
                      ) : (
                        <Maximize className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-black/30 text-white hover:bg-black/50"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => triggerAlert(camera.id, "Potential Drowning Detected")}>
                          Test Alert
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {camera.status === "online" && !alertMode && (
                  <div className="absolute bottom-3 right-3">
                    <div className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">Live</div>
                  </div>
                )}

                {alertMode && activeAlert?.cameraId === camera.id && (
                  <>
                    <div className="absolute inset-0 border-8 border-red-500 animate-pulse-border pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-red-600 p-3 animate-pulse">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-white mr-2" />
                        <div className="text-white font-medium">{activeAlert.message}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={dismissAlert}
                          className="ml-auto text-white hover:bg-red-700 px-2 py-1 h-auto"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
