import jwt from 'jsonwebtoken';

import { errorHandler } from './error.js';

export const verifyUserToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, 'You are not authenticated!'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Token is not valid!'));

        req.user = user;
        next();
    });
}

export const verifyAdmin = (req, res, next) => {
    // console.log(req.cookies)
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, 'You are not authenticated!'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Token is not valid!'));

        // Check if the user role is "admin"
        if (user.role !== 'admin') {
            return next(errorHandler(403, 'Access Denied:You is Not an Admin!'));
        }

        req.user = user;
        next();
    });
};