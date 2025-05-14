"use client"

import { useRef, useState, useEffect } from "react"
import { Pause, Play, Volume2, Download, Maximize } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
  src: string
}

const cameraZones = [
    { name: "BILLY", color: "#A5D6A7" },
    { name: "BOM", color: "#EF9A9A" },
    { name: "Guy Shower", color: "#FFE082" },
    { name: "blue", color: "#90CAF9" },
  ]

const getZoneColor = (zone: string | undefined) =>
  cameraZones.find((z) => z.name === zone)?.color || "#E0E0E0"

export function RecordingCard({ src, zone }: VideoPlayerProps & { zone?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [duration, setDuration] = useState(0)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100
      setVolume(value[0])
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [src])

  return (
    <Card className="overflow-hidden">
      <div ref={containerRef} className="relative bg-black aspect-video">
        {zone && (
            <div className="absolute top-3 left-3">
                <div
                className="text-xs font-medium px-3 py-1 rounded-full shadow"
                style={{ backgroundColor: getZoneColor(zone), color: "#000" }}
                >
                {zone}
                </div>
            </div>
        )}
        <video
          ref={videoRef}
          className="w-full h-full"
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setCurrentTime(0)
              setDuration(videoRef.current.duration)
            }
          }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex flex-col gap-2">
            <Slider
              value={[currentTime]}
              max={videoRef.current?.duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="h-1.5"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <span className="text-xs text-white">
  {formatTime(currentTime)} / {formatTime(duration)}
</span>

                <div className="flex items-center gap-2 ml-3">
                  <Volume2 className="h-4 w-4 text-white" />
                  <Slider
                    value={[volume]}
                    max={100}
                    onValueChange={handleVolumeChange}
                    className="w-20 h-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => alert("Download started")}
                >
                  <Download className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={toggleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
