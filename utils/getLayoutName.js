const getLayoutName = (req)=>{
    const accessibles = ['admin', 'superadmin'];
    const noAccess = ['driver', 'stockmanager', 'shiftmanager'];
    // if user in the cookies is no json, parse it
    const user = typeof req.cookies.user === 'string' ? JSON.parse(req.cookies.user) : req.cookies.user;
    console.log('user', user);
    const role = user ? user?.role?.name : null;
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