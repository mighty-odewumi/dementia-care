import { VideoIndexerClient } from '@azure/video-indexer'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json()
    
    const client = new VideoIndexerClient(
      process.env.AZURE_VIDEO_INDEXER_SUBSCRIPTION_KEY!,
      process.env.AZURE_VIDEO_INDEXER_LOCATION!,
      process.env.AZURE_VIDEO_INDEXER_ACCOUNT_ID!
    )

    const indexingResult = await client.uploadVideo(videoId, {
      videoUrl: `${process.env.AZURE_STORAGE_URL}/videos/${videoId}`,
      privacy: 'Private',
      language: 'en-US',
    })

    return NextResponse.json({ indexId: indexingResult.id })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to start video indexing' },
      { status: 500 }
    )
  }
}