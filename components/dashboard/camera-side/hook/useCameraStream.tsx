'use client'

import { useEffect, useRef } from 'react'
import {
  createMetadataEmitter,
  startMetadataStream,
  MetadataStatus,
} from '@/lib/camera-connection'

interface UseCameraStreamOptions {
  url: string
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onMetadata: (status: MetadataStatus) => void
}

export function useCameraStream({
  url,
  canvasRef,
  onMetadata,
}: UseCameraStreamOptions) {
  const lastMetadataRef = useRef<MetadataStatus>('safe')
  const currentFrameRef = useRef<Blob | null>(null)
  const cancelledRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    cancelledRef.current = false
    const emitter = createMetadataEmitter()

    const draw = async () => {
      if (cancelledRef.current) return

      const frame = currentFrameRef.current
      const canvas = canvasRef.current
      if (!frame || !canvas) {
        rafIdRef.current = requestAnimationFrame(draw)
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        rafIdRef.current = requestAnimationFrame(draw)
        return
      }

      try {
        const img = await createImageBitmap(frame)
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        currentFrameRef.current = null
      } catch (e) {
        console.warn('Failed to draw frame:', e)
      }

      rafIdRef.current = requestAnimationFrame(draw)
    }

    // Start stream
    startMetadataStream(emitter, {
      url,
      username: 'admin',
      password: '1234',
      onFrame: (blob) => {
        currentFrameRef.current = blob
      },
    })

    emitter.on('metadata', (status: MetadataStatus) => {
      if (lastMetadataRef.current !== 'danger' && status === 'danger') {
        onMetadata(status)
      }
      lastMetadataRef.current = status
    })

    rafIdRef.current = requestAnimationFrame(draw)

    return () => {
      cancelledRef.current = true
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      emitter.removeAllListeners()
    }
  }, [url])
}
