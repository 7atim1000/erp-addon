const createHttpError = require('http-errors');
const config = require('../config/config');
//const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const isVerifiedUser = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        // const accessToken = req.headers.authorization; 

        if (!accessToken) {
            const error = createHttpError(401, 'Please provide token!') ;  // unauthorized
            return next(error);
        }

        const decodeToken = jwt.verify(accessToken, config.accessTokenSecret);
       
        const user = await User.findById(decodeToken._id);
        if (!user) {
            const error = createHttpError(401, 'User not exist');
            return next(error);
        }

        req.user = user;
        next();

    } catch (error) {
        const err = createHttpError(401, 'Invalid Token!');
        next(err);
    }
}


module.exports = { isVerifiedUser };


// 1- Make sure you are actually storing the token in localStorage after login:
// localStorage.setItem('token', response.data.token);
// Check in your browser’s DevTools → Application → Local Storage that token exists and is not empty.

// 2. Token is not being sent on first request
// If your Redux state is not restored from localStorage on refresh, your app may redirect to /auth before the token is set.
// Make sure your login logic sets both Redux state and localStorage.

// 3. Backend expects Bearer token
// Your interceptor is correct
// config.headers.Authorization = `Bearer ${token}`;
// Make sure your backend expects the header as Authorization: Bearer <token>.


// Summary:

// Interceptor is correct.
// Make sure token is present in localStorage and valid.
// Make sure it is sent in the request headers.
// Check backend for token validation logic.
// If you share your login logic and backend auth middleware, I can help you debug further!



//Your middleware is currently reading the token from cookies:

//But your frontend is sending the token in the Authorization header, not as a cookie.
