

export default function isActive(req, res, next) {
    const user = req.cookies.user;
    if (user.status == "active") {
        next();
    } else {
        res.status(403).redirect('/login');
    }
}