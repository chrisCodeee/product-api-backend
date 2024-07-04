const express = require("express");
const { Products, validate } = require("../models/product");
const { User } = require("../models/user");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/add", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const product = new Products({ ...req.body, userId: req.body.userId });

	await product.save();
	res.send(product);
});

// To get the product based on the user
router.get("/views/:userId", auth, async (req, res) => {
	const product = await Products.find({ userId: req.params.userId });

	// if (product.length === 0) return res.status(404).send("No Product Found");
	res.send(product);
});

// To get a particular product based on the user
router.get("/views/:userId/:productId", async (req, res) => {
	const product = await Products.find({ userId: req.params.userId }).findOne({ _id: req.params.productId });

	res.send(product);
});

// To delete a product based on the user logged in
router.delete("/views/:userId/:productId", auth, async (req, res) => {
	let product = await Products.find({ userId: req.params.userId }).findOneAndDelete({ _id: req.params.productId });

	if (!product) return res.status(404).send("The product with the given ID was not found.");

	product = await Products.find({ userId: req.params.userId });

	res.send(product);
});

// To update the product based on the user logged in
router.put("/views/:userId/:productId", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let product = await Products.find({ userId: req.params.userId }).findOneAndUpdate(
		{ _id: req.params.productId },
		{
			name: req.body.name,
			price: req.body.price,
			category: req.body.category,
			company: req.body.company,
		},
		{ new: true }
	);

	if (!product) return res.status(404).send("The product with the given ID was not found.");

	product = await Products.find({ userId: req.params.userId });

	res.send(product);
});

function escapeRegex(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// To Search for Product
router.get("/search/:key", auth, async (req, res) => {
	let result = await Products.find({
		$or: [
			{
				name: { $regex: escapeRegex(req.params.key.toLowerCase()) },
			},
			{
				company: { $regex: escapeRegex(req.params.key.toLowerCase()) },
			},
		],
	});

	if (result.length === 0) return res.status(404).send(`No product found`);

	res.send(result);
});

module.exports = router;
