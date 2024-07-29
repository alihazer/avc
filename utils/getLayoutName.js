const getLayoutName = (req)=>{
    const accessibles = ['admin', 'superadmin'];
    const noAccess = ['driver', 'stockmanager', 'shiftmanager'];
    const role = req?.cookies?.user?.role?.name;
    if(!role){
        return 'layouts/userLayout';
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