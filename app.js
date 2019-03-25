const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
require('dotenv').config();

const port = process.env.PORT;
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

/**
 * Connect database
 */
mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function () {
    console.log("mongodb connected");
});

/**
 * Routes
 */
require("./routes/apiRoutes")(app);


app.listen(port, function () {
    console.log(`App started on port ${port}`);
});
