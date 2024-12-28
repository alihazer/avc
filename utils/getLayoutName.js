const getLayoutName = (req)=>{
    const accessibles = ['admin', 'superadmin'];
    const noAccess = ['driver', 'stockmanager', 'shiftmanager'];
    let role;
    try {
        role = JSON.parse(req?.cookies?.user)?.role?.name;
    } catch (error) {
        console.log(error);
    }
    if(!role){
        return 'layouts/loginLayout';
    }
    if(accessibles.includes(role)){
        return 'layouts/layout';
    }
    if(noAccess.includes(role)){
        return 'layouts/noAccessLayout';
    }
    return 'layouts/userLayout';
}

export default getLayoutName;