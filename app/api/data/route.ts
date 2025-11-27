
import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    message: "Hello from the backend!",
    timestamp: new Date().toISOString(),
  };

  // To allow your external website to access this API, we add CORS headers.
  // The '*' value allows any website to access it. For better security,
  // you could replace '*' with your specific website's domain.
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  return NextResponse.json(data, { headers });
}

// We also add an OPTIONS handler for "preflight" requests that browsers
// send before making the actual request to check for CORS permissions.
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
