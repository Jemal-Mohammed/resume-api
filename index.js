import express from 'express';
import mongoose from 'mongoose';
import router from "./routes/index.js"
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import cors from "cors";
import errorMiddleware from "./utils/error.js"
const app = express();
app.use(cookieParser());
const port = 5000;
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000',"https://resume-qiy8.onrender.com"]
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(router);
dotenv.config({
  path:'.env'
});
// Connect to MongoDB
// const mongoUrl = 'mongodb://127.0.0.1:27017/resume';
mongoose.connect(process.env.DB_URL, {
}).then((con) => {
  console.log(`db connected successfully with connection string:${con.connection.host}`);
});
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
