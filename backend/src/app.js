
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import Message from '../src/models/message.js';
import { Server } from 'socket.io';
import http from 'http';
import wafMiddleware from './middlewares/firewall.middleware.js';
import propertyRoutes from './routes/property.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js'


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // restrict in production
    methods: ['GET', 'POST'],
  },
});

app.use(express.json({
    limit: "16kb"
}))


app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(wafMiddleware)


app.use(express.static("public"))


app.use(cookieParser());
// Socket.IO real-time messaging
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
console.log('Socket.IO connection established');
  // Listen for direct messages
  socket.on('direct message', async ({ sender, receiver, message }) => {
    console.log('Direct message event received:', { sender, receiver, message });
    if (!sender || !receiver || !message) return;
console.log('Direct message received:', { sender, receiver, message });
    // Save message
    const msg = new Message({ sender, receiver, message });
    await msg.save();

    // Emit message to receiver if connected
    // You could implement rooms or user-to-socket mapping for targeting
    io.emit('direct message', msg); // For demo: broadcast to all (improve later)
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});




// Setting the routes
//app.use('/v1/users/',userRoutes);
//this endpoint is use for vendor apis
app.use('/v1/properties/',propertyRoutes);
//this endpoint is use for user apis
app.use('/v1/user/',userRoutes);
app.use('/api/admin/',adminRoutes)
export { app,server }



