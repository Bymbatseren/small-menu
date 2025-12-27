import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/socket";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { event, data } = req.body;

    if (!event || !data) {
        return res.status(400).json({ error: "Missing event or data" });
    }

    if (res.socket.server.io) {
        res.socket.server.io.emit(event, data);
        return res.status(200).json({ message: "Event emitted" });
    } else {
        return res.status(500).json({ error: "Socket.io not running" });
    }
}
