require('dotenv').config();

const config = Object.freeze({
    

    port: process.env.PORT || 8080,
    databaseURI: process.env.MONGODB_URI || "mongodb+srv://7atim1000:W3U9MSjltr7xGw55@cluster0.plrzarg.mongodb.net/Erp",     

    nodeEnv : process.env.NODE_ENV || "development",
    

    accessTokenSecret : process.env.JWT_SECRET,


   // RAZORPAY_KEY_ID:RAZORPYSECRET,
   //
   //  RAZORPAY_KEY_SECRET:RAZORPYSECRET

});

module.exports = config ;