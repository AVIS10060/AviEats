import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async (data) => {
      try {
        const userId = data?.userId;
        if (!userId) return;

        await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true },
        );
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("update-location", async ({ latitude, longitude, userId }) => {
    console.log("📥 SERVER RECEIVED LOCATION");
      try {
        const user = await User.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          isOnline: true,
          socketId: socket.id,
        });

        if (user) {
        console.log("📡 EMITTING TO CLIENTS");
          io.emit("updateDeliveryLocation",{
            deliveryBoyId : userId,
            latitude,
            longitude
          });
          console.log("📤 EMIT LOCATION", latitude, longitude);
        }
      } catch (error) {
        console.log(error)
      }
    });

    // 🔥 handle disconnect
    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            isOnline: false,
            socketId: null,
          },
        );
      } catch (error) {
        console.log(error);
      }
    });
  });
};


// this is a comment 