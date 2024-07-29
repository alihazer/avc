

export default function isActive(req, res, next) {
    const user = req.cookies.user;
    console.log("User: ", user);
    if (user.status == "active") {
        next();
    } else {
        res.status(403).redirect('/login');
    }
}