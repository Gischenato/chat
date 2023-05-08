import express from "express";
import userController from "../controllers/userController";

export const userRouter = express.Router();

userRouter.post("/register", userController.registerUser)

userRouter.get("/all", userController.getAllUsers)

userRouter.get("/find/:userId", userController.findUser)

userRouter.delete("/delete", userController.deleteUser)