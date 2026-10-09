import mongoose from 'mongoose';
import { config } from './env.js';

let isMongoConnected = false;

export async function connectDB(): Promise<boolean> {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB at', config.mongodbUri);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB not connected. Running with in-memory persistence fallback.');
    return false;
  }
}

export function isDbConnected(): boolean {
  return isMongoConnected;
}
