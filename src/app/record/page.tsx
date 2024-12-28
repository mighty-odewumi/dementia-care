"use client"

import VideoUpload from "@/components/VideoUpload";

export default function Record() {

   return (
    <>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Record Activity</h1>
        <VideoUpload />
      </div>
    </>
  )
}
