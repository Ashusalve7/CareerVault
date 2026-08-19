import { NextRequest, NextResponse } from 'next/server';
import { r2Client } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string | null;
    const versionTag = formData.get('versionTag') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const r2Key = `resumes/${timestamp}-${safeFileName}`;

    // Read bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudflare R2 via S3 SDK client
    const uploadResult = await r2Client.uploadBuffer(
      r2Key,
      buffer,
      file.type || 'application/pdf'
    );

    return NextResponse.json({
      success: true,
      key: uploadResult.key,
      url: uploadResult.url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      name: name || file.name,
      versionTag: versionTag || 'v1.0',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('R2 upload error:', errorMessage);
    return NextResponse.json(
      { error: `R2 Upload failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
