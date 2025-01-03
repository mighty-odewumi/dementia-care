import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!
    );

    const containerClient = blobServiceClient.getContainerClient('videos');
    const blobName = `${Date.now()}.webm`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const sasToken = await blockBlobClient.generateSasUrl({
      // @ts-expect-error Write should be here
      permissions: BlobSASPermissions.write,
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
    });

    return NextResponse.json({ 
      url: sasToken,
      videoId: blobName
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}