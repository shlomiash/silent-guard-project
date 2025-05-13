// lib/streaming/metadataCanvas.ts
import { EventEmitter } from 'events'

export type MetadataStatus = 'safe' | 'danger' | 'unknown'

interface Options {
  url: string
  username: string
  password: string
  onFrame: (frame: Blob) => void
}

export function createMetadataEmitter(): EventEmitter {
  return new EventEmitter()
}

export async function startMetadataStream(
  emitter: EventEmitter,
  { url, username, password, onFrame }: Options
) {
  const boundary = new TextEncoder().encode('--frame')
  const decoder = new TextDecoder()

  const response = await fetch(
    `http://81.218.244.80:5000/stream?url=${encodeURIComponent(url)}`,
    {
      headers: {
        Authorization: 'Basic ' + btoa(username + ':' + password),
      },
    }
  )

  const reader = response.body?.getReader()
  let buffer = new Uint8Array()

  while (true) {
    const { value, done } = await reader?.read() || {}
    if (done || !value) break

    const combined = new Uint8Array(buffer.length + value.length)
    combined.set(buffer)
    combined.set(value, buffer.length)
    buffer = combined

    let boundaryIndex
    while ((boundaryIndex = indexOfSubarray(buffer, boundary)) !== -1) {
      const part = buffer.slice(0, boundaryIndex)
      buffer = buffer.slice(boundaryIndex + boundary.length)

      const headerEnd = indexOfSubarray(part, new TextEncoder().encode('\r\n\r\n'))
      if (headerEnd === -1) continue

      const header = decoder.decode(part.slice(0, headerEnd))
      const body = part.slice(headerEnd + 4)

      const metadata = (header.match(/Metadata:\s*(.+)/)?.[1].trim() ??
        'unknown') as MetadataStatus

      emitter.emit('metadata', metadata)
      onFrame(new Blob([body], { type: 'image/jpeg' }))
    }
  }
}

function indexOfSubarray(buffer: Uint8Array, sub: Uint8Array): number {
  for (let i = 0; i <= buffer.length - sub.length; i++) {
    let match = true
    for (let j = 0; j < sub.length; j++) {
      if (buffer[i + j] !== sub[j]) {
        match = false
        break
      }
    }
    if (match) return i
  }
  return -1
}
