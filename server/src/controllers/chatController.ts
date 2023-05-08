import { Request, Response } from "express";
import chatModel from "../models/chatModel";

const createChat = async (req:Request, res:Response) => {
    const {firstId, secondId} = req.body

    try {
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]}
        })

        if (chat) return res.status(200).json(chat)

        const newChat = new chatModel({
            members: [firstId, secondId]
        })

        const response = await newChat.save()

        res.status(201).json(response)

    } catch(error:any) {
        console.error(error)
        res.status(500).json(error)
    } 
}

const getUserChats = async(req:Request, res:Response) => {
    const { userId } = req.params

    try {
        const chats = await chatModel.find({
            members: {$in: [userId]}
        })

        res.status(200).json(chats)
    } catch(error:any) {
        console.error(error)
        res.status(500).json(error)
    }
}

const findChat = async(req:Request, res:Response) => {
    try {
        const { firstId, secondId } = req.params
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]}
        })

        if (!chat) return res.status(404).json({msg: "Chat not found"})

        res.status(200).json(chat)
    } catch(error:any) {
        console.error(error)
        res.status(500).json(error)
    }
}

const deleteChat = async(req:Request, res:Response) => {
    try {
        const { chatId } = req.body
        const chat = await chatModel.findById(chatId)

        if (!chat) return res.status(404).json({msg: "Chat not found"})

        await chatModel.deleteOne({_id: chatId})
        res.status(200).json({msg: "Chat deleted"})
    } catch (error:any) {
        console.error(error)
        res.status(500).json(error)
    }
}

export default {
    createChat,
    getUserChats,
    findChat,
    deleteChat
}