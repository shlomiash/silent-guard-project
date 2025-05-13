'use client'

import { useEffect, useRef } from 'react'
import {
  createMetadataEmitter,
  startMetadataStream,
  MetadataStatus,
} from '@/lib/camera-connection'

// Create global maps to track streams and their active canvases
const streamEmitters = new Map<string, ReturnType<typeof createMetadataEmitter>>()
const streamFrames = new Map<string, Blob | null>()
const activeCanvases = new Map<string, HTMLCanvasElement | null>()

// Track metadata status for each stream
const streamMetadataStatus = new Map<string, MetadataStatus>()

// Track metadata callbacks for each component using a stream
const metadataCallbacks = new Map<string, Set<(status: MetadataStatus) => void>>()

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
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Register this canvas as the active one for this URL
    activeCanvases.set(url, canvasRef.current)
    
    // Register the onMetadata callback for this component
    if (!metadataCallbacks.has(url)) {
      metadataCallbacks.set(url, new Set())
    }
    metadataCallbacks.get(url)?.add(onMetadata)
    
    // Create a new emitter if this is the first time initializing this stream
    if (!streamEmitters.has(url)) {
      const emitter = createMetadataEmitter()
      streamEmitters.set(url, emitter)
      streamMetadataStatus.set(url, 'safe')
      
      // Initialize the stream
      startMetadataStream(emitter, {
        url,
        username: 'admin',
        password: '1234',
        onFrame: (blob) => {
          // Always update the frame, even during danger events
          streamFrames.set(url, blob)
        },
      })
      
      // Set up metadata listener
      emitter.on('metadata', (status: MetadataStatus) => {
        const previousStatus = streamMetadataStatus.get(url) || 'safe'
        streamMetadataStatus.set(url, status)
        
        // Only trigger callbacks when transitioning to danger
        if (previousStatus !== 'danger' && status === 'danger') {
          // Notify all registered components
          metadataCallbacks.get(url)?.forEach(callback => {
            callback(status)
          })
        }
      })
    }
    
    // Drawing function to render frames on the canvas
    const draw = async () => {
      // Skip if this canvas is no longer the active one for this URL
      if (activeCanvases.get(url) !== canvasRef.current) {
        rafIdRef.current = requestAnimationFrame(draw)
        return
      }
      
      const frame = streamFrames.get(url)
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
        // Clear the frame after drawing to avoid redrawing the same frame
        streamFrames.set(url, null)
      } catch (e) {
        console.warn('Failed to draw frame:', e)
      }

      rafIdRef.current = requestAnimationFrame(draw)
    }

    // Start the drawing loop
    rafIdRef.current = requestAnimationFrame(draw)

    return () => {
      // When component unmounts, check if this canvas is still the active one
      if (activeCanvases.get(url) === canvasRef.current) {
        activeCanvases.set(url, null)
      }
      
      // Cancel animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      
      // Remove this component's metadata callback
      const callbacks = metadataCallbacks.get(url)
      if (callbacks) {
        callbacks.delete(onMetadata)
      }
      
      // Note: We don't remove the emitter or clean up the stream
      // This ensures the stream keeps running when navigating between routes
      // If you want to reset streams when completely exiting the dashboard,
      // that should be handled at a higher level
    }
  }, [url, onMetadata])



}
