import dotenv from "dotenv";
// import { app } from "./app.js";
import { server } from "./app.js";

import connectDB from './db/dbconnection.js'

// dotenv.config({
//     path: './.env'
// })
dotenv.config();
const PORT = process.env.PORT || 5001;

connectDB().then(
    ()=>{
        server.on('error',(err)=>{
            console.log("Internal Server Error",err);
            throw err;
        })
        server.listen(PORT,()=>{
            console.log(`Server is Listening at port ${process.env.PORT}`);
        })
    }
).catch(
    (err)=>{
        console.log("Mongodb Connection failed : ",err)
    }
);