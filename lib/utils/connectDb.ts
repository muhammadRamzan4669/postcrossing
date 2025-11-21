import mongoose from "mongoose";

export default async function connectDb() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI)
    throw new Error('MONGODB_URI is not defined in environment variables');

  try {
    if (mongoose.connection.readyState >= 1)
      return;
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  } catch (e) {
    console.error(e)
    throw e;
  }
}
