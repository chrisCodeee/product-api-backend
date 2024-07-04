const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		lowercase: true,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	category: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
	},
	company: {
		type: String,
		required: true,
	},
});

const Products = mongoose.model("Products", productSchema);

function validateProduct(product) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required(),
		price: Joi.number().min(0).required(),
		category: Joi.string().required(),
		userId: Joi.string(),
		company: Joi.string().min(3).max(255).required(),
	});

	return schema.validate(product);
}

exports.validate = validateProduct;

exports.Products = Products;
