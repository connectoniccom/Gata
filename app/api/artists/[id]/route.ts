
import { NextResponse } from 'next/server';
import { artists } from '@/app/artists/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const artist = artists.find((a) => a.id === id);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (artist) {
    return NextResponse.json(artist, { headers });
  } else {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404, headers });
  }
}

// We also add an OPTIONS handler for "preflight" requests that browsers
// send before making the actual request to check for CORS permissions.
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
