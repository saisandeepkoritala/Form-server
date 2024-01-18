const express = require("express");
const userRouter = require("./routes/userRoutes");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
    credentials:true,
    origin:"https://saisandeepkoritala-form-app.netlify.app"
}));

const verifyToken = (req, res, next) => {
    const token = req.cookies.Access_token;
    console.log("token is ",token)

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'MY-SECRET-KEY-TO-HASH-THE-LOGIN', (err, decoded) => {
        if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
        }

        // Attach the decoded payload to the request for further use
        console.log("hi")
        req.user = decoded;
        next();
    });
};

// Use this middleware on routes that require authentication

app.use("/api/v1/user",userRouter);
app.use("/secure-route",verifyToken, (req, res) => {
    console.log("running on")
    // Access the decoded user information using req.user
        res.json({ message: 'Authorized', user: req.user });
    });

module.exports = app;