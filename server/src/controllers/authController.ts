import { Request, Response } from 'express';
import userModel from "../models/userModel";

const login = async (req: Request, res: Response) => {
    try {
        const { name, password } = req.body

        const user = await userModel.findOne({ name })

        if (!user) return res.status(404).json({ msg: "User not found" })
        if (user.password !== password) return res.status(401).json({ msg: "Wrong password" })

        res.status(200).json({ msg: "User logged in successfully", id: user._id })
    } catch (error) {
        console.warn(error)
        res.status(500).json(error)
    }
}

const refresh = async (req: Request, res: Response) => {
    try {
        const { id } = req.body
        
        const user = await userModel.findById(id)

        if (!user) return res.status(404).json({ msg: "User not found" })

        res.status(200).json({ id: user._id, name: user.name })
    } catch (error) {
        console.warn(error)
        res.status(500).json(error)
    }
}


export default { login, refresh }