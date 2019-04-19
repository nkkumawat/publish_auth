
// const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// const env = process.env.NODE_ENV || 'development';
// const config = require('../config/config.json')[env];


// module.exports = {
// 	verifyToken: function(req, res, next) {
// 		const token = req.cookies.jwtToken;
// 		if (token) {
// 		    jwt.verify(token, config.superSecret, function(err, decoded) {      
// 		        if (err) {
// 		            return res.send(
// 						'<p>Failed to authenticate token. '
// 						        + 'Click <a href="logout">Logout</a></p>'
// 					);    
// 		        } else {

// 		            // check if email is present
// 		            if (!decoded.email) {
// 		                res.redirect('/login');
// 		            } else {
// 		                // if everything is good, save to request for use in other routes
// 		                req.decoded = decoded; 
// 		                next();
// 		            }
// 		        }
// 		    });
// 		} else {
// 		    res.redirect('/login');
// 		}
// 	}
// }