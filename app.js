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
    origin:"http://localhost:3000"
}));


app.use("/api/v1/user",userRouter);


module.exports = app;