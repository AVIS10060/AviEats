import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import shopRouter from './routes/shop.routes.js'
import itemRouter from './routes/item.route.js'
import orderRouter from './routes/order.routes.js'

dotenv.config()

const app = express()
const port = process.env.PORT

// ✅ 1. CORS first
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

// ✅ 2. Body parsers
app.use(express.json())
app.use(cookieParser())
app.use("/public", express.static("public"))

// ✅ 3. Log every request hitting Express
app.use((req, res, next) => {
    console.log(`🚀 ${req.method} ${req.url}`)
    next()
})

// ✅ 4. Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)

// ✅ 5. Start server ONLY after DB connects
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`✅ Server running on port ${port}`)
    })
})