import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import {  createItem, deleteItem, ediItem, getItemByCity, getItemById } from '../controllers/item.controllers.js'
import { upload } from '../middlewares/multer.js'

const itemRouter = express.Router()

itemRouter.post("/add-item",isAuth,upload.single("image"),createItem)
itemRouter.post("/edit-item/:itemId",isAuth,upload.single("image"),ediItem)
itemRouter.get("/get-by-id/:itemId",isAuth,getItemById)
itemRouter.get("/delete/:itemId",isAuth,deleteItem)
itemRouter.get("/get-by-city/:city",isAuth,getItemByCity)


export default itemRouter

