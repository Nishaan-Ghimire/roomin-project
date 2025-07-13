import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Property from '../models/properties.model.js';
import { indexProperty } from '../elasticsearch/sync.js';

const syncAllProperties = async () => {
  try {
    // ✅ Connect to MongoDB first
    await mongoose.connect("mongodb+srv://nitigyajoshi12:u7Po5XmCol4ZJ7NY@cluster0.ebbmggq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    const props = await Property.find();
    for (const prop of props) {
      await indexProperty(prop);
    }

    console.log('✅ All properties synced to Elasticsearch');
    process.exit(0); // Exit cleanly
  } catch (err) {
    console.error('❌ Sync failed:', err);
    process.exit(1); // Exit with error
  }
};

syncAllProperties();
