import express from "express";
import chatController from "../controllers/chatController";

export const chatRouter = express.Router();

chatRouter.post("/create", chatController.createChat)

chatRouter.get("/:userId", chatController.getUserChats)

chatRouter.get("/find/:firstId/:secondId", chatController.findChat)

chatRouter.delete("/", chatController.deleteChat)
