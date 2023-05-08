import userModel from "../models/userModel";
import { Request, Response } from 'express'

const registerUser = async (req: Request, res: Response) => {
    try{
        let { name, password } = req.body

        if (!name || !password) return res.status(400).json({msg: "All fields are required."})
    
        let user = await userModel.findOne({name})
    
        if (user) return res.status(403).json({msg: "User already exists"})
    
        user = new userModel({ name, password })
        
        await user.save()
        
        console.log(JSON.stringify({
            route: "user/register",
            user: user.name,
            password: user.password
        }, null, 2))
        res.status(200).json({
            msg: "User registered successfully",
            id: user._id
        })
    } catch(error) {
        console.warn(error)
        return res.status(500).json(error)
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    console.log('getAllUsers')
    try{
        const users = await userModel.find()
        return res.status(200).json(users)
    } catch(error) {
        console.warn(error)
        return res.status(500).json(error)
    }
}

const findUser = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params

        if (!userId) return res.status(400).json({msg: "UserId is required."})
    
        const user = await userModel.findById(userId)
    
        if (!user) return res.status(404).json({msg: "User not found"})
    
        res.status(200).json(user)
    } catch(error) {
        console.warn(error)
        res.status(500).json(error)
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try{
        const { name } = req.body
    
        if (!name) return res.status(400).json({msg: "Name field is required."})
    
        const user = await userModel.findOne({name})
    
        if (!user) return res.status(404).json({msg: "User not found"})
    
        await userModel.deleteOne({name})

        res.status(200).json({msg: "User deleted successfully"})
    } catch(error) {
        console.warn(error)
        res.status(500).json(error)
    }
}

export default {
    registerUser,
    getAllUsers,
    findUser,
    deleteUser
};