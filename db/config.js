const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
	.connect(`${MONGO_URI}`)
	.then(() => console.log("Connected to Monogodb................"))
	.catch((err) => console.error("Could not connect to Monogodb............." + err));
// mongodb+srv://ChrisNze:Chris08037980751@chriscluster.k0ihdyw.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=ChrisCluster
