// const isVerifiedUser = async (req, res, next) => {
//     try {
//         // Get token from Authorization header
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             const error = createHttpError(401, 'Please provide token!');
//             return next(error);
//         }
//         const accessToken = authHeader.split(' ')[1];

//         const decodeToken = jwt.verify(accessToken, config.accessTokenSecret);

//         const user = await User.findById(decodeToken._id);
//         if (!user) {
//             const error = createHttpError(401, 'User not exist');
//             return next(error);
//         }

//         req.user = user;
//         next();

// Yes, you can fix this by editing your frontend to send the token as a cookie instead of in the Authorization header, but it is not recommended for most modern SPAs unless you specifically want to use cookies for authentication.