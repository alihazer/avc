import connectDB from './dbConfig.js';
import User from '../models/User.js';

const setupRoles = async()=>{
    await connectDB();
    
    
    const result = await User.insertMany(users);
    if(result){
        console.log("users inserted successfully");
    }
    else{
        console.log("Roles insertion failed");
    }
    process.exit();

    

}


export default setupRoles;