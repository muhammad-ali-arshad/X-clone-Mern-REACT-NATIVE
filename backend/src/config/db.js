import mongoose from "mongoose"
import {ENV} from "./env.js"

export const connectDB = async ()=>{
    try {
        await mongoose.connect(ENV.MONGO_URI)
        console.log("MONGODB has been Successfully Connected")
    } catch (error) {
        console.log("Error while connecting to DataBase");
        process.exit(1)
    }
}
