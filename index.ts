import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const app = express();
dotenv.config({ path: "./config.env" });
app.use(express.json());
app.use(cors());

import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 1e8,
});


const port = process.env.PORT;

io.on("connection", (socket) => {
    console.log('New client connected', socket.id);
    socket.on("joinChat", async (chatId) => {
        console.log(chatId);
        try {
            socket.join(chatId);
            console.log(`User joined chat: ${chatId}`);
        } catch (error) {
            io.to(socket.id).emit("error", error);
        }
    });
    socket.on("sendMessage", async ({ chatId, content, senderId, receiverId }: { chatId: string, content: string, senderId: string, receiverId: string }) => {
        // console.log(chatId)
        console.log("message", chatId, content, senderId, receiverId)
        try {
            io.to(chatId).emit("newMessage", { chatId, content, senderId, receiverId });
        } catch (error) {
            io.to(socket.id).emit("error", error);
        }
    });
});

server.listen(port, () => console.log("server running on port:" + port));