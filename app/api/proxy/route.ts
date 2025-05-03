import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new Response('Missing URL', { status: 400 });

  const basicAuth = 'Basic ' + Buffer.from('admin:1234').toString('base64');

  const cameraRes = await fetch(url, {
    headers: { Authorization: basicAuth },
  });

  if (!cameraRes.ok || !cameraRes.body) {
    return new Response('Failed to fetch stream', { status: 500 });
  }

  return new Response(cameraRes.body, {
    headers: {
      'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
    },
  });
}
