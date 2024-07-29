import jwt from 'jsonwebtoken';

export default function isLoggedIn(req, res, next) {
    const token = req?.cookies?.token;
    console.log(token);
    if (!token) {
        return res.status(401).render('login', { message: 'Please Login' });
    }
    try{
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(401).render('login', { message: 'Please Login' });
    }

};



