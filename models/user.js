const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const passwordComplexity = require("joi-password-complexity");

dotenv.config();

const secretkey = process.env.JWT_PRIVATE_KEY;

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
	},
	email: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	},
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id, name: this.name, email: this.email }, secretkey, { expiresIn: "2h" });
	return token;
};

const User = mongoose.model("User", userSchema);

const passwordComplexityOptions = {
	min: 8,
	max: 30,
	lowerCase: 1,
	upperCase: 1,
	numeric: 1,
	symbol: 1,
	// requirementCount: 4,
};

function validateRegisterUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(255).required(),
		email: Joi.string().min(3).max(255).required().email(),
		password: passwordComplexity(passwordComplexityOptions),
	});

	return schema.validate(user);
}

function validateLoginUser(user) {
	const schema = Joi.object({
		email: Joi.string().min(3).max(255).required().email(),
		password: Joi.string().required(),
	});

	return schema.validate(user);
}

exports.validateRegisterUser = validateRegisterUser;
exports.validateLoginUser = validateLoginUser;
exports.secretKey = secretkey;
exports.User = User;
