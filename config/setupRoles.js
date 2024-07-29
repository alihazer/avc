import connectDB from './dbConfig.js';
import Role from '../models/Roles.js';

const setupRoles = async()=>{
    await connectDB();
    const roles = [
        // {
        //     "name": "superadmin",
        //     "permissions": ["manage_users", "view_analytics", "manage_roles", "manage_stock", "manage_shifts", "manage_ambulances", "create_triage"]
        // },
        // {
        //     "name": "admin",
        //     "permissions": ["manage_users", "view_analytics", "manage_stock", "manage_shifts", "manage_ambulances", "create_triage"]
        // },
        // {
        //     "name": "stockmanager",
        //     "permissions": ["manage_stock", "create_triage", "manage_ambulances"]
        // },
        // {
        //     "name": "shiftmanager",
        //     "permissions": ["manage_shifts", "manage_ambulances", "create_triage"]
        // },
        {
            "name": "driver",
            "permissions": ["manage_ambulances", "create_triage"]
        },
        // {
        //     "name": "paramedic",
        //     "permissions": ["create_triage"]
        // }
    ];
    const result = await Role.insertMany(roles);
    if(result){
        console.log("Roles inserted successfully");
    }
    else{
        console.log("Roles insertion failed");
    }
    process.exit();

    

}


export default setupRoles;