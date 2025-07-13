import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  points: { type: Number, default: 0 },
  totalLoaded: { type: Number, default: 0 }, // total rupees loaded
  transactions: [
    {
      amount: Number,
      points: Number,
      method: String, // 'khalti' or 'esewa'
      txnId: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;