
import { NextResponse } from 'next/server';
import { artists } from '@/app/artists/data';

export async function GET() {
  // To allow your external website to access this API, we add CORS headers.
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  return NextResponse.json(artists, { headers });
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
