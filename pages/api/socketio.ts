import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

// Disable the default body parser so Socket.IO can handle the upgrade requests properly
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = (req: NextApiRequest, res: any) => {
  if (res.socket.server.io) {
    console.log('Socket.IO server already running')
    res.end()
    return
  }

  console.log('Initializing Socket.IO server...')
  
  const io = new Server(res.socket.server, {
    // Use a different path than this API route to avoid Next.js intercepting Engine.IO requests
    path: '/api/socket',
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
  })

  res.socket.server.io = io

  io.on('connection', (socket) => {
    console.log('✅ Socket.IO client connected:', socket.id)

    // Join a chat room
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId)
      console.log(`📡 Socket ${socket.id} joined room ${roomId}`)
      
      // Notify others in the room about new user
      socket.to(roomId).emit('user-joined', {
        socketId: socket.id,
        timestamp: new Date().toISOString()
      })
    })

    // Handle sending messages
    socket.on('send-message', (data: { roomId: string; message: any }) => {
      try {
        console.log('📤 Broadcasting message to room:', data.roomId)
        
        // Emit to all users in the room
        io.to(data.roomId).emit('new-message', data.message)
        
      } catch (error) {
        console.error('❌ Error broadcasting message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Handle typing indicators
    socket.on('typing', (data: { roomId: string; userId: string; userName: string; isTyping: boolean }) => {
      console.log(`⌨️ User typing in room ${data.roomId}:`, data.isTyping)
      socket.to(data.roomId).emit('user-typing', {
        userId: data.userId,
        userName: data.userName,
        isTyping: data.isTyping
      })
    })

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`❌ Socket ${socket.id} disconnected:`, reason)
    })

    // Handle errors
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })
  })

  console.log('🚀 Socket.IO server initialized successfully')
  res.end()
}

export default handler