import rateLimit from 'express-rate-limit';

// General Limit
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: {
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Login Limit
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Only 5 failed login attempts per hour per IP
    message: {
        message: "Too many login attempts, please try again in an hour"
    },
    standardHeaders: true,
    legacyHeaders: false,
});