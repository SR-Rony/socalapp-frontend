// FILE: lib/socket.ts
import { io, Socket } from "socket.io-client";
import { AppDispatch } from "@/redux/store";
import { addStory } from "@/redux/features/storySlice";

let socket: Socket | null = null;

export const connectSocket = (token: string, dispatch: AppDispatch) => {
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
  });

  // Listen new story
  socket.on("story:new", (data) => {
    console.log("📣 New story received:", data.story);
    dispatch(addStory(data.story));
  });

  socket.on("disconnect", () => {
    console.log("⚠️ Socket disconnected");
  });

  return socket;
};
