const jwt = require("jsonwebtoken");
const { secretKey } = require("../models/user");

function auth(req, res, next) {
	const token = req.headers["authorization"];
	// const token = req.headers.authorization;
	// const token = req.header("authorization");

	if (!token) return res.status(401).send("Access denied. No token provided");

	try {
		const decoded = jwt.verify(token, secretKey);
		req.user = decoded;

		console.log(req.user);
		next();
	} catch (ex) {
		res.status(400).send("Invalid token");
	}
}

module.exports = auth;
