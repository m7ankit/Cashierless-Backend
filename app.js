require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
var { isUnauthorized } = require("./middlewares/auth")

//DB Connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log("DB CONNECTED");
    })
    .catch((err) => {
        console.log(err)
    });


//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());


//My Routes
app.use("/api", authRoutes);

//Custom middleware for error handling in express-jwt
app.use(isUnauthorized);

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
    console.log(`app is running at ${port}`);
});