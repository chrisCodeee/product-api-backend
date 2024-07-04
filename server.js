const express = require("express");
const cors = require("cors");
require("./db/config");
const products = require("./routes/products");
const users = require("./routes/users");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors()); //Used to give access to our frontend to get data from our backend. Note that this is not advisable as our api is open to any website to access

require("./production/prod")(app);

// Routes
app.use("/products", products);
app.use("/users", users);

// Port

app.listen(PORT, console.log(`App started on port ${PORT}`));
