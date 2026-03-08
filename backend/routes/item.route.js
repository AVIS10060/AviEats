import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import {  createItem, ediItem } from '../controllers/item.controllers.js'
import { upload } from '../middlewares/multer.js'

const itemRouter = express.Router()

itemRouter.get("/add-item",isAuth,upload.single("image"),createItem)
itemRouter.get("/edit-item/:itemId",isAuth,upload.single("image"),ediItem)

export default itemRouter

