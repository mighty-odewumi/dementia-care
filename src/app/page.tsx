"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Camera, MessageSquare, Brain } from 'lucide-react'
import { useAuth } from '@clerk/nextjs';
import { LoginPrompt } from '@/components/LoginPrompt'

export default function HomePage() {
  const { isLoaded, userId} = useAuth();
  console.log(userId);

  if (!isLoaded && !userId) {
    return <LoginPrompt />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">MemorySafe</h1>
        <p className="text-xl text-gray-400 mb-8">Record your day and chat with AI to remember and reflect</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/record" className="w-full">
          <Button size="lg" className="w-full text-lg h-24 bg-blue-600 hover:bg-blue-700">
            <Camera className="mr-2 " size={24} /> 
            <div>
              <div>Record Your Day</div>
              <div className="text-sm font-normal">Capture your daily activities</div>
            </div>
          </Button>
        </Link>
        <Link href="/chat" className="w-full">
          <Button size="lg" className="w-full text-lg h-24 bg-green-600 hover:bg-green-700">
            <MessageSquare className="mr-2 " size={24} />
            <div>
              <div>Chat with AI</div>
              <div className="text-sm font-normal">Reflect on your experiences</div>
            </div>
          </Button>
        </Link>
      </div>
      <div className="flex items-center text-gray-400 mt-8">
        <Brain className="w-6 h-6 mr-2" />
        <span>Powered by Azure AI services to support your memory</span>
      </div>
    </div>
  )
}
