

export default function isActive(req, res, next) 
{
    const user = JSON.parse(req.cookies.user);
    if (user.status == "active") {
        next();
    }else {
        console.log("User is not active");
        res.status(403).redirect('/login');
    }
}