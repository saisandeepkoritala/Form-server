const express = require("express");
const userRouter = require("./routes/userRoutes");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials:true,
    origin:"https://saisandeepkoritala-formapp.netlify.app"
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
        req.user = decoded;
        next();
    });
};

// Use this middleware on routes that require authentication
app.get('/secure-route', verifyToken, (req, res) => {
  // Access the decoded user information using req.user
    res.json({ message: 'Authorized', user: req.user });
});

app.use("/api/v1/user",userRouter);

module.exports = app;