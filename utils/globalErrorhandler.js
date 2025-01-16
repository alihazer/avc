import getLayoutName from "./getLayoutName.js";

const globalErrorHandler = (err, req, res, next) => {
    let message = (process.env.NODE_ENV === 'development') 
                    ? 
                    (err && err.message) ? err.message : 'An unknown error occurred' 
                    : 'An error occurred, please try again later';
    if(res.statusCode === 404) {
        message = 'Page not found';
    }
    const statusCode = err.statusCode || 500;
    const layout = getLayoutName(req);
    console.log(err);
    return res.status(statusCode).render('error', { layout, message });
}

export default globalErrorHandler;