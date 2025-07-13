// controllers/message.controller.js
import Message from '../models/message.js';
import {User} from '../models/users/user_model.js';
import mongoose from 'mongoose';

export const getMessages = async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

export const setMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;
  if (!sender || !receiver || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const newMessage = await Message.create({ sender, receiver, message });
    res.status(201).json({ success: true, message: 'Message sent', data: newMessage });
  } catch {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getChatUsers = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    const userSet = new Set();
    messages.forEach(msg => {
      if (msg.sender.toString() !== userId) userSet.add(msg.sender.toString());
      if (msg.receiver.toString() !== userId) userSet.add(msg.receiver.toString());
    });

    const users = await User.find({ _id: { $in: [...userSet] } }).select('name email profilePhoto');
    res.status(200).json({ success: true, users });
  } catch {
    res.status(500).json({ error: 'Failed to fetch chat users' });
  }
};
