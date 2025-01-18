import mongoose from 'mongoose';
import Player from '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI;

console.log(`MONGODB_URI: ${MONGODB_URI}`);

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

console.log("1");


const dbConnect = async () => {
  console.log("oooooo");
  
  if (mongoose.connection.readyState >= 1) return;

  console.log("2");
  
  try {
    console.log("3");
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

console.log("dbConnect");

dbConnect();
export default dbConnect;
