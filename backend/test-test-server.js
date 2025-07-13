import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // allow all origins, restrict in production
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Chat message schema
const chatSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  message: { type: String },  // For text message or image URL
  type: { type: String, enum: ['text', 'image'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 159xyz.png
  }
});
const upload = multer({ storage: storage });

// API to upload image
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, imageUrl });
});

// API to get chat history between two users
app.get('/chats/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const chats = await Chat.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ createdAt: 1 }); // ascending time
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch chats', error: error.message });
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('sendMessage', async (data) => {
    /*
      data = {
        senderId: 'user1',
        receiverId: 'user2',
        message: 'Hello' or imageUrl,
        type: 'text' or 'image'
      }
    */
    try {
      const chat = new Chat(data);
      await chat.save();

      // Emit message to room (both users)
      const roomId = [data.senderId, data.receiverId].sort().join('_');
      io.to(roomId).emit('receiveMessage', chat);
    } catch (err) {
      console.error('Error saving chat:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
