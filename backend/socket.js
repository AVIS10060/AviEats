import User from "./models/user.model.js"

export const socketHandler = (io) => {
  io.on("connection", (socket) => {

    socket.on("identity", async (data) => {
      try {
        const userId = data?.userId
        if (!userId) return

        await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true }
        )

      } catch (error) {
        console.log(error)
      }
    })

    // 🔥 handle disconnect
    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            isOnline: false,
            socketId: null,
          }
        )
      } catch (error) {
        console.log(error)
      }
    })

  })
}