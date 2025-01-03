'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, Pause } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'
import { LoginPrompt } from '@/components/LoginPrompt'

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [displayChatButton, setDisplayChatButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const router = useRouter()
  const { isLoaded, userId } = useAuth()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      streamRef.current = stream
      setIsRecording(true)
    } catch (err) {
      console.error("Error accessing media devices:", err)
    }
  }

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setIsRecording(false)
    simulateUpload()
    setDisplayChatButton(true);
  }

  const simulateUpload = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setUploadProgress(0)
        }, 1000)
      }
    }, 500)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isLoaded || !userId) {
    return <LoginPrompt />;
  }

  return (
    <>
      <div className="ml-16 mt-8">
        <UserButton />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        </div>
        <div className="mt-8 flex flex-col items-center">
          <Button
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-full w-20 h-20 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isRecording ? <Pause className="w-10 h-10" /> : <Camera className="w-10 h-10" />}
          </Button>
          <div className="mt-4 text-2xl font-bold">{formatDuration(duration)}</div>
        </div>
        {uploadProgress > 0 && (
          <div className="mt-8 w-full max-w-md">
            <div className="flex items-center mb-2">
              <Upload className="mr-2" />
              <span>Uploading video...</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
        {displayChatButton && (
          <Button
            onClick={() => router.push('/chat')}
            className="mt-4"
          >
            Go to Chat
          </Button>
        )}
      </div>
    </>
  )
}
