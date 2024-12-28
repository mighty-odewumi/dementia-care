"use client"

import React, { useRef, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, StopCircle, Upload, X } from "lucide-react";

export default function VideoUpload() {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'default' });
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const showAlert = (message, type = 'default') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'default' }), 3000);
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      showAlert("Recording started");
    } catch (error) {
      showAlert(`Failed to start recording: ${error.message}`, 'error');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      showAlert("Recording stopped");
    }
  }, [isRecording]);

  const uploadVideo = async () => {
    if (!recordedBlob) return;

    setIsUploading(true);
    try {
      // Get upload URL
      const urlResponse = await fetch('/api/videos/upload-url');
      const { url, videoId } = await urlResponse.json();

      // Upload to Azure Blob Storage
      await fetch(url, {
        method: 'PUT',
        body: recordedBlob,
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'video/webm',
        },
      });

      // Start processing
      await fetch('/api/videos/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      showAlert("Video uploaded and processing started");
      setRecordedBlob(null);
    } catch (error) {
      showAlert(`Failed to upload video: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {alert.show && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{alert.message}</AlertDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2"
            onClick={() => setAlert({ show: false, message: '', type: 'default' })}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}
      
      <Card className="p-6">
        <div className="space-y-4">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline
            className="w-full aspect-video bg-slate-900 rounded-lg"
          />
          
          <div className="flex justify-center gap-4">
            {!isRecording && !recordedBlob && (
              <Button onClick={startRecording}>
                <Camera className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            )}
            
            {isRecording && (
              <Button 
                onClick={stopRecording} 
                variant="destructive"
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
            
            {recordedBlob && (
              <Button 
                onClick={uploadVideo} 
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload Recording'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}