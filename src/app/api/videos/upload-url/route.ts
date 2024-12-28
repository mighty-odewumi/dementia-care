import { BlobServiceClient } from '@azure/storage-blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!
    )

    const containerClient = blobServiceClient.getContainerClient('videos')
    const blobName = `${Date.now()}.mp4`
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    const sasToken = await blockBlobClient.generateSasUrl({
      permissions: 'write',
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
    })

    return NextResponse.json({ 
      url: sasToken,
      videoId: blobName
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}