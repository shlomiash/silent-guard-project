'use client'

import { useState } from 'react'
import CameraCard from './camera-card'
import { AlertTriangle } from 'lucide-react'

interface Camera {
  id: string
  name: string
  url: string
  category: string
}

interface Props {
  cameras: Camera[]
  currentCategory: string
}

export default function CameraGrid({ cameras, currentCategory }: Props) {
  const [fullscreenCameraId, setFullscreenCameraId] = useState<string | null>(null)
  const [activeAlerts, setActiveAlerts] = useState<Record<string, boolean>>({})
  const [externalAlert, setExternalAlert] = useState<{
    cameraName: string
    category: string
  } | null>(null)

  const handleDanger = (camera: Camera) => {
    setActiveAlerts((prev) => ({ ...prev, [camera.id]: true }))
    if (camera.category !== currentCategory) {
      setExternalAlert({ cameraName: camera.name, category: camera.category })
    }
  }

  const dismissAlert = (cameraId: string) => {
    setActiveAlerts((prev) => ({ ...prev, [cameraId]: false }))
    setExternalAlert(null)
  }

  return (
    <div className="grid gap-6 p-20" style={{
      gridTemplateColumns: fullscreenCameraId ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'
    }}>
      {externalAlert && (
        <div className="bg-yellow-300 text-black p-3 rounded shadow flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" />
          אזעקה בזיהוי מצלמה "{externalAlert.cameraName}" מקטגוריה "{externalAlert.category}"
        </div>
      )}

      {cameras.map((camera) => {
        const isVisible = fullscreenCameraId === null || fullscreenCameraId === camera.id

        return (
          <div key={camera.id} className={isVisible ? '' : 'hidden'}>
            <CameraCard
              camera={camera}
              isFullscreen={fullscreenCameraId === camera.id}
              onToggleFullscreen={() =>
                setFullscreenCameraId((prev) => (prev === camera.id ? null : camera.id))
              }
              onDanger={() => handleDanger(camera)}
              showAlert={!!activeAlerts[camera.id]}
              dismissAlert={() => dismissAlert(camera.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
