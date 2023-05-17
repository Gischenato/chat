import { Server } from 'socket.io'
import { SOCKET_EVENTS } from './events'
import { IMessage } from './IMessage'
import { messageModel } from './models/messageModel'
import userModel from './models/usersModel'
import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const io = new Server({
    cors: {
        // allow access from any origin
        origin: "*",
        // allow all methods
        methods: ["GET", "POST"]
    }
})

// map users to their socket id
const users = new Map()

io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    users.set(socket.handshake.query.id, socket.id)
    console.log('-------------------------------------');
    console.log("New connection: ", socket.id)
    console.log(socket.handshake.query)
    console.log(socket.handshake.auth)
    console.log(socket.id)
    console.log('-------------------------------------');

    console.log(users)

    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
        users.set(socket.handshake.query.id, 'OFFLINE')
        console.log('-------------------------------------');
        console.log("Disconnected: ", socket.id)
        console.log(socket.handshake.query)
        console.log(socket.handshake.auth)
        console.log(socket.id)
        console.log('-------------------------------------');
    
        console.log(users)
    })

    socket.on(SOCKET_EVENTS.PRIVATE_MESSAGE, handlePrivateMessage)
})

type IPrivateMessage = {
    message: IMessage
    receiver: string
}

async function handlePrivateMessage({message, receiver}: IPrivateMessage) {
    console.log(message, receiver)
    const { _id, chatId, createdAt, senderId, text, updatedAt } = message

    const newMessage = new messageModel({
        chatId,
        senderId,
        text,
        _id,
    })

    const response = await newMessage.save()

    console.log('=====================================');
    console.log("Received message: ", text)
    console.log('-------------------------------------');
    console.log(users)
    console.log('-------------------------------------');
    let receiverSocketId = users.get(receiver)
    let senderSocketId = users.get(message.senderId)

    if (!receiverSocketId) { // there is no user or user is offline
        console.log("Receiver not found: ", receiver)
        console.log('=====================================');

        // try to find user in database
        const user = await userModel.findById(receiver)
        if (!user) // user not found
            return

        uptadeUserInMap(receiver, 'OFFLINE') // user is offline

    } 

    console.log("Receiver found: ", receiver)
    console.log(`Receiver is ${receiverSocketId === 'OFFLINE' ? 'OFFLINE' : 'ONLINE'}: `)
    console.log('=====================================');
    if (receiverSocketId === 'OFFLINE') {
        
    } else {
        io.to(receiverSocketId).emit(SOCKET_EVENTS.PRIVATE_MESSAGE, response)
        
    }
    // io.to(senderSocketId).emit(SOCKET_EVENTS.PRIVATE_MESSAGE, response)
}

async function uptadeUserInMap(userId: string, socketId: string) {
    users.set(userId, socketId)
}

const uri = process.env.ATLAS_URI || ''
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
.then((a) => {
    console.log('MongoDB connected...')
})
.catch(err => console.log('MongoDB connection failed: ', err))

io.listen(3000)