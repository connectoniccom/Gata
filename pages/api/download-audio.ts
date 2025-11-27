
import type { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { videoUrl } = req.body;

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: 'Invalid or missing YouTube URL' });
    }

    try {
      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title.replace(/[^\w\s]/gi, '_'); // Sanitize title

      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
      res.setHeader('Content-Type', 'audio/mpeg');

      const stream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });

      ffmpeg(stream)
        .audioBitrate(128)
        .format('mp3')
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          // Don't send a response here if one has already been sent.
          if (!res.headersSent) {
            res.status(500).json({ error: 'Error converting to MP3' });
          }
        })
        .pipe(res, { end: true });

    } catch (error) {
      console.error('ytdl error:', error);
       if (!res.headersSent) {
        res.status(500).json({ error: 'Error fetching video information' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
