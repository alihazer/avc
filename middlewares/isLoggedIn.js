import jwt from 'jsonwebtoken';

export default async function isLoggedIn(req, res, next) {
    const { token } = req.cookies || {};
    if (!token) {
        return res.status(401).redirect('/login');
    }
    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.warn('Token expired:', error.message);
        } else {
            console.error('Token validation failed:', error.message);
        }
        return res.status(401).redirect('/login');
    }
}




