'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader, Brain, ArrowRight } from 'lucide-react'
import { useAuth, UserButton } from '@clerk/nextjs'
import { LoginPrompt } from '@/components/LoginPrompt'
import Link from 'next/link'

type Message = {
  id: number
  text: string
  sender: 'user' | 'ai'
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isLoaded, userId } = useAuth()

  const prompts = [
    "What did I do today?",
    "Show me highlights from last week",
    "When was my last doctor's appointment?",
    "What's my favorite restaurant?"
  ]

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = { id: Date.now(), text: input, sender: 'user' }
      setMessages([...messages, newMessage])
      setInput('')
      setIsLoading(true)
      simulateAIResponse()
    }
  }

  const simulateAIResponse = () => {
    setTimeout(() => {
      const aiMessage: Message = { 
        id: Date.now(), 
        text: "Based on the video analysis, you had a productive day. You went for a walk in the park, read a book, and had dinner with your family.", 
        sender: 'ai' 
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 5000)
  }

  if (!isLoaded || !userId) {
    return <LoginPrompt />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="bg-gray-800 p-4 text-white flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">MemorySafe</Link>
        <UserButton />
      </header>
      <div className="flex-1 overflow-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <Brain className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to MemorySafe Bot</h2>
            <p className="mb-4">Ask me anything about your day or your recorded memories.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
              {prompts.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-between text-left"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                    message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 p-3 rounded-lg flex items-center">
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  AI is thinking...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-800">
        <div className="flex space-x-2 max-w-2xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your day..."
            className="flex-1 bg-gray-700 text-white border-gray-600"
          />
          <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
