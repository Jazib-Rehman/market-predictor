import { Server } from 'socket.io';
import type { NextApiRequest } from 'next';
import type { NextApiResponse } from 'next';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: any;
  };
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    
    res.socket.server.io = io;
    
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });
    
    // Test confetti disabled
    // setTimeout(() => {
    //   console.log('Emitting test celebrate event');
    //   io.emit('celebrate', {asset: 'Bitcoin', direction: 'up'});
    // }, 3000);
    
    console.log('Socket.IO server initialized');
  } else {
    console.log('Socket.IO server already running');
  }
  
  res.end();
};

export default ioHandler; 