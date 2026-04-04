import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });
    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;