import mongoose from "mongoose";

const dbConn = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONN_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConn;
