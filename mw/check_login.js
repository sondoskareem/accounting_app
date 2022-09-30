let {User} = require("../models/users");
var jwt = require('jsonwebtoken');


exports.checkLogin_admin= function (req, res, next) {
	var token = req.headers.token
	if (token) {
		try {
			jwt.verify(token,  '____z0@kjafsjawdjjkjkwejDsdsdsd',
				function (err, decoded) {
					if (err) {
						res.status(401).send({ admin: false })
					}
					User.findOne({
						_id: decoded.id
					}, (err, user) => {
						if (err) {
							res.status(401).send({ msg: err })
						}
						if (user) {
							if(user.isActive){
								req.checkLogin_admin = user
								next()
							}else{
								res.status(401).send({ msg: "Please confirm your email first" })
							}
						} else {
							// console.log('err')
							res.status(401).send({ admin: false })
						}


					})

				});
		}

		catch (error) {
			res.send(error)
		}
	} else {
		res.status(400).send({ msg: 'err' })
	}
}



