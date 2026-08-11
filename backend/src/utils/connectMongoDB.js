import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CLOUD_MONGO_URL);
    console.log("MongoDB connected on : ", conn.connection.host);
  } catch (error) {
    console.log("MongoDB error : ", error);
  }
};
