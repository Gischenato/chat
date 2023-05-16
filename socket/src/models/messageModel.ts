import { v4 as uuidv4} from 'uuid'
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    chatId: String,
    senderId: String,
    text: String
}, { timestamps: true })

export const messageModel = mongoose.model("Message", messageSchema);