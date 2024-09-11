"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: "./config.env" });
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 1e8,
});
const port = process.env.PORT;
io.on("connection", (socket) => {
    console.log('New client connected', socket.id);
    socket.on("joinChat", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(chatId);
        try {
            socket.join(chatId);
            console.log(`User joined chat: ${chatId}`);
        }
        catch (error) {
            io.to(socket.id).emit("error", error);
        }
    }));
    socket.on("sendMessage", ({ chatId, content, senderId, receiverId }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(chatId);
        try {
            io.to(chatId).emit("newMessage", { chatId, content, senderId, receiverId });
        }
        catch (error) {
            io.to(socket.id).emit("error", error);
        }
    }));
});
server.listen(port, () => console.log("server running on port:" + port));
