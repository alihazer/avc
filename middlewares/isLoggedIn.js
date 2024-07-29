import jwt from 'jsonwebtoken';

export default function isLoggedIn(req, res, next) {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).redirect('/login');
    }
    try{
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        console.error(error);
        return res.status(401).redirect('/login');
    }

};



