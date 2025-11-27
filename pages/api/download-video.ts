
import type { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { videoUrl } = req.body;

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: 'Invalid or missing YouTube URL' });
    }

    try {
      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title.replace(/[^\w\s]/gi, '_'); // Sanitize title
      
      // Corrected: Set Content-Disposition header to suggest a filename for download
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);

      // Set Content-Type to video/mp4 for direct download
      res.setHeader('Content-Type', 'video/mp4');

      ytdl(videoUrl, { filter: 'videoandaudio', quality: 'highest' }).pipe(res);

    } catch (error) {
      console.error('ytdl error:', error);
      // Ensure response is not sent again if headers are already sent
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error fetching video information' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
