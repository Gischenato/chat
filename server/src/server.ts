// import fastify from "fastify";
// import { userRoutes } from './routes/user.routes'

// const app = fastify();

// app.get("/", async (request, reply) => {
// });

// app.register(userRoutes)

// app.listen({ port: 3000 })
// .then(() => console.log("Server is running on port 3000"))


import express from 'express'
import cors from 'cors'
import mongoose, {ConnectOptions} from 'mongoose'
import dotenv from "dotenv";

import { userRouter } from './routes/user.routes'
import { authRouter } from './routes/auth.routes'
import { chatRouter } from './routes/chat.routes'
import { messageRouter } from './routes/messages.routes'

const app = express();
dotenv.config()


app.use(express.json())
app.use(cors())

app.use("/auth", authRouter)
app.use("/users", userRouter)
app.use("/chat", chatRouter)
app.use("/messages", messageRouter)

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI || ''

app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    }
)

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log('MongoDB connection failed: ', err))