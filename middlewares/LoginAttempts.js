import LoginAttempt from "../models/loginAttempts.js";

const loginRateLimiter = async (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.ip; 
    const deviceInfo = req.headers["user-agent"];
    const maxAttempts = 5;
    const blockTime = 30 * 60 * 1000; 

    try {
        const attemptsCount = await LoginAttempt.countDocuments({
          deviceInfo,
          ipAddress: ip,
          timestamp: { $gte: new Date(Date.now() - blockTime) }
        });
        if (attemptsCount >= maxAttempts) {
            return res.status(429).render('login', {message: "Too many login attempts. Try again in 30 minutes.", layout: 'layouts/loginLayout'});
        }
        req.loginAttempts = attemptsCount;
        next();
    } catch (error) {
        console.error("Rate limiter error:", error);
            return res.status(500).render('login', {message: "An error occurred, please try again later", layout: 'layouts/loginLayout'});
    }
};

export default loginRateLimiter;
