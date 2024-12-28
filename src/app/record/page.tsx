"use client"


import { Button } from "@/components/ui/button";
import VideoUpload from "@/components/VideoUpload";
import { useToast } from "@/hooks/use-toast";

export default function Record() {
  const { toast } = useToast();

   return (
    <>
      <VideoUpload />
      <Button
        onClick={() => {
          toast({
            title: 'Success',
            description: 'Video uploaded and processing started',
          })
        }}
      >
        Show Toast
      </Button>
    </>
  )
}
