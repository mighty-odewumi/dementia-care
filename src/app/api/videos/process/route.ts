import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();
    
    // Get access token for Video Indexer
    const accessToken = await fetch(
      `https://api.videoindexer.ai/auth/${process.env.AZURE_VIDEO_INDEXER_LOCATION}/Accounts/${process.env.AZURE_VIDEO_INDEXER_ACCOUNT_ID}/AccessToken`,
      {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_VIDEO_INDEXER_SUBSCRIPTION_KEY!
        }
      }
    ).then(res => res.text());

    // Upload video to Video Indexer
    const videoUrl = `${process.env.AZURE_STORAGE_URL}/videos/${videoId}`;
    const uploadResponse = await fetch(
      `https://api.videoindexer.ai/${process.env.AZURE_VIDEO_INDEXER_LOCATION}/Accounts/${process.env.AZURE_VIDEO_INDEXER_ACCOUNT_ID}/Videos`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoUrl,
          name: videoId,
          privacy: 'Private',
          language: 'en-US'
        })
      }
    ).then(res => res.json());

    return NextResponse.json({ indexId: uploadResponse.id });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to start video processing' },
      { status: 500 }
    );
  }
}