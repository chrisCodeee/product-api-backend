const express = require("express");
const lodash = require("lodash");
const bcrypt = require("bcrypt");
const { validateRegisterUser, validateLoginUser, User, secretKey } = require("../models/user");
const router = express.Router();

// console.log(secretKey);

router.post("/signup", async (req, res) => {
	const { error } = validateRegisterUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });

	if (user) return res.status(400).send("User already registered. Please login");

	user = new User(req.body);

	const salt = await bcrypt.genSalt(10);

	user.password = await bcrypt.hash(user.password, salt);

	await user.save();

	// To generate the token for this user
	const token = await user.generateAuthToken();
	if (!token) res.send("Something went wrong!");

	// This stores the token in the header
	res.send({ user, token });
});

router.post("/login", async (req, res) => {
	const { error } = validateLoginUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Invalid email or password");

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid email or password.");

	// res.send(lodash.pick(user, ["_id", "name", "email"]));

	const token = await user.generateAuthToken();
	if (!token) res.send("Something went wrong!");

	res.send({ user, token });
});

module.exports = router;
