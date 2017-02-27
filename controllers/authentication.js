const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	res.send({ token: tokenforUser(req.user) });
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;
	
	if (!email || !password) {
		return res. status(422).send({ error: 'You must provide an email and a password' });
	}

	// Check if user exists
	User.findOne({ email: email }, function(err, existingUser) {
		if (err) { return next(err); }

	// Error if user already exists
		if (existingUser) {
			return res.status(422).send({ error: 'Email already exists' });
		}

	// If user does not exist, create and save record
		const user = new User({
			email: email,
			password: password
		});

		user.save(function(err) {
			if (err) { return next(err); }
		
	// Indicate user created
		res.json({ token: tokenForUser(user) });
		});
	});
}