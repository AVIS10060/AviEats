import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import http from 'http'
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.route.js";
import orderRouter from "./routes/order.routes.js";
import { Server, Socket } from "socket.io";
import { socketHandler } from "./socket.js";

dotenv.config();


const app = express();
const server = http.createServer(app)
const port = process.env.PORT || 8000;


const io = new Server(server,{
  cors:{
    // origin:"http://localhost:5173",
    origin:"https://avieats.onrender.com",
    credentials:true,
    methods:['POST','GET']
  }
})

app.set('io',io)

// Middlewares


app.use(
  cors({
    // origin: "http://localhost:5173",
    origin:"https://avieats.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Static folder
app.use("/public", express.static("public"));

app.options("*", cors());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);


socketHandler(io)

// DB connection
connectDB();

// Server start
server.listen(port, () => {
  console.log(` this Server is running on port ${port}`);
});
