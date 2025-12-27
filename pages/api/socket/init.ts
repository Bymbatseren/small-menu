import { Server as NetServer } from "net";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types/socket";

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    console.log("Socket Init API executed");
    if (!res.socket.server.io) {
        console.log("*First use, starting socket.io*");
        const httpServer: any = res.socket.server;
        const io = new ServerIO(httpServer, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        io.on("connection", (socket) => {
            console.log("Socket connected:", socket.id);

            socket.on("disconnect", () => {
                console.log("Socket disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
    } else {
        console.log("Socket.io already running");
    }

    res.status(200).json({ success: true, message: "Socket is running" });
};

export default ioHandler;
