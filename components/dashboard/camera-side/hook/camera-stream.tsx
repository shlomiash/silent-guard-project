'use client'

import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCameraStream } from '@/components/dashboard/camera-side/hook/useCameraStream'
import CameraWarning from '@/components/dashboard/camera-side/camera-warning'

interface Camera {
  id: string
  name: string
  url: string
  category: string // category ID
}

export default function CameraStreamerManager({ cameras }: { cameras: Camera[] }) {
  const [warning, setWarning] = useState<{ name: string; category: string } | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const pathname = usePathname()

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  return (
    <>
      {cameras.map((camera) => {
        const canvasRef = useRef<HTMLCanvasElement>(null)

        useCameraStream({
          url: camera.url,
          canvasRef,
          onMetadata: () => {
            const expectedPath = `/dashboard/categories/${camera.category}`
            if (pathname !== expectedPath) {
              setWarning({ name: camera.name, category: camera.category })
              setIsDismissed(false)
            }
          },
        })

        return <canvas key={camera.id} ref={canvasRef} style={{ display: 'none' }} />
      })}

      {/* Warning UI */}
      {(warning && pathname !== `/dashboard/categories/${warning.category}` && !isDismissed) && (
        <CameraWarning
          cameraName={warning.name}
          categoryId={warning.category}
          onDismiss={handleDismiss}
        />
      )}
    </>
  )
}
