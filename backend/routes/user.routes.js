import express from 'express'
import { getCurrrentUser } from '../controllers/user.controllers.js'
import isAuth from '../middlewares/isAuth.js'

const userRouter = express.Router()

userRouter.get("/current",isAuth,getCurrrentUser)

export default userRouter

