import mongoose from "mongoose"

const mongo_uri = process.env.MONGO_URI || ""

if (!mongo_uri){
    throw new Error ("MONGO_URI is not defined in environment variables")
}
let cached = (global as any).mongoose
if (!cached){
    cached = (global as any).mongoose = {conn: null, promise: null}
}
async function DBConnect(){
    if (cached.conn){
        return cached.conn
    }
    if (!cached.promise){
        const opts = {
            bufferCommands: false,
        }
        cached.promise = mongoose.connect(mongo_uri, opts).then((mongoose) => {
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}
export default DBConnect