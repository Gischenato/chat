import express from "express";
import messageController from "../controllers/messageController";

export const messageRouter = express.Router();

messageRouter.post("/", messageController.createMessage)

messageRouter.get("/:chatId", messageController.getMessages)