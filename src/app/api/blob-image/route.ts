import { head } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_BLOB_HOST = 'sd0phdecfctmljdq.private.blob.vercel-storage.com';

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');

  if (!rawUrl) {
    return new NextResponse('Missing url', { status: 400 });
  }

  // Validate the URL is from our own private blob store only
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }
  if (parsed.hostname !== ALLOWED_BLOB_HOST) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new NextResponse('Blob token not configured', { status: 500 });
  }

  // head() calls blob.vercel.com (public API) — works from localhost and Vercel
  let info: Awaited<ReturnType<typeof head>>;
  try {
    info = await head(rawUrl, { token });
  } catch {
    return new NextResponse('Blob not found', { status: 404 });
  }

  // Fetch the blob content with the Bearer token so auth is satisfied.
  // This fetch succeeds on Vercel infra (can reach *.private.blob.vercel-storage.com).
  const imageResponse = await fetch(info.url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!imageResponse.ok) {
    return new NextResponse('Image not found', { status: imageResponse.status });
  }

  const buffer = await imageResponse.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': info.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
