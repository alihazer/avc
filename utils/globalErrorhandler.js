import getLayoutName from "./getLayoutName.js";

const globalErrorHandler = (err, req, res, next) => {
    const message = (process.env.NODE_ENV === 'development') 
                    ? 
                        (err && err.message) 
                            ? err.message 
                            : 'An unknown error occurred' 
                    : 'An error occurred, please try again later';
    const statusCode = err.statusCode || 500;
    const layout = getLayoutName(req);
    console.log(err);
    return res.status(statusCode).render('error', { layout, message });
    // if not logged in, no layout:
    // const token = req?.cookies?.token;
    // if (!token) {
    //     return res.status(statusCode).render('error', { ,message });
    // }else{
    //     try{
    //         // Verify token
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //         const layout = getLayoutName(req);
    //         console.log(err);
    //         return res.status(statusCode).render('error', { layout, message });
            
    //     }
    //     catch(error){
    //         console.error(error);
    //         return res.status(statusCode).render('error', { message });
    //     } 
    // }
}

export default globalErrorHandler;