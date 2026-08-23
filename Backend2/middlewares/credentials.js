const {allowedOrigins} = require('../config/allowedOrigins')

const credentials = (req, res, next) => {
    console.log('Origin:', req.headers.origin);
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    next();
}

module.exports = { credentials }