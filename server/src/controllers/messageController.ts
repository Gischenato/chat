import { Request, Response } from "express";
import { messageModel } from "../models/messageModel";

// createMEssage
const createMessage = async (req:Request, res:Response) => {
    const { chatId, senderId, text } = req.body

    try {
        const message = new messageModel({
            chatId,
            senderId,
            text
        })

        const response = await message.save()
        res.status(201).json(response)
    } catch(error:any) {
        console.error(error)
        res.status(500).json(error)
    }
};

// getMessages
const getMessages = async (req:Request, res:Response) => {
    const { chatId, page } = req.params
    console.log(chatId, page)
    const limit = 15

    try {
        const messages = await messageModel
            .find({chatId})
            .skip(Number(page))
            .limit(limit)
            .sort({createdAt: -1})
        res.status(200).json(messages)
    } catch(error:any) {
        console.error(error)
        res.status(500).json(error)
    }
}

export default { 
    createMessage,
    getMessages
}