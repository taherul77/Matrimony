import { NextApiRequest, NextApiResponse } from 'next';
import { getSocketServer, NextApiResponseServerIO } from '@/lib/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === 'GET') {
    // Initialize Socket.IO server
    try {
      if (!res.socket.server.io) {
        console.log('Initializing Socket.IO server...');
        const io = getSocketServer(res.socket.server);
        res.socket.server.io = io;
        console.log('Socket.IO server initialized');
      } else {
        console.log('Socket.IO server already running');
      }

      res.status(200).json({
        message: 'Socket.IO server running',
        status: 'connected'
      });
    } catch (error) {
      console.error('Socket.IO initialization error:', error);
      res.status(500).json({
        error: 'Failed to initialize Socket.IO server',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}