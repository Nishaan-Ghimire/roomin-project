import mongoose from "mongoose";


const connectDB = async()=>{
    console.log(process.env.MONGODB_URI,process.env.DB_Name);
    try{
        const connectionInstance = await mongoose.connect("mongodb+srv://nitigyajoshi12:u7Po5XmCol4ZJ7NY@cluster0.ebbmggq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log(`Connected to database : ${connectionInstance.connection.host}`);
    }catch(error){
        console.error('ERROR : ',error)
        process.exit(1);
    }
}

export default connectDB;