import jwt from 'jsonwebtoken';
import moment from 'moment';

export default function isLoggedIn(req, res, next) {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).redirect('/login');
    }
    try{
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const date = new Date();
        console.log("Welcome " + decoded.username, "Logged in at: " + moment(date).format('MMMM Do YYYY, h:mm:ss a'));
        req.user = decoded;
        next();
    }
    catch(error){
        console.error(error);
        return res.status(401).redirect('/login');
    }
};



