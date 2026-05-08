import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    console.log("Connected Successfully!");

  } catch (err) {
    console.log("error", err)
    process.exit(1)
  }
}