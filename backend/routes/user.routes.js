import express from 'express'
import { getCurrrentUser, updateUserLocation } from '../controllers/user.controllers.js'
import isAuth from '../middlewares/isAuth.js'

const userRouter = express.Router()

userRouter.get("/current",isAuth,getCurrrentUser)
userRouter.post("/update-location",isAuth,updateUserLocation)

export default userRouter

