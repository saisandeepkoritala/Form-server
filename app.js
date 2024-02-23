const express = require("express");
const userRouter = require("./routes/userRoutes");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
    credentials:true,
    origin:"https://saisandeepkoritala-form-app.netlify.app"
}));



app.use("/api/v1/user",userRouter);


module.exports = app;