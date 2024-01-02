const express = require("express");
const userRouter = express.Router();
const {loginUser,signUp,secureRoute} = require("../controllers/userController");

userRouter.route("/login").post(loginUser)

userRouter.route("/signup").post(signUp)
userRouter.route("/secure-route").get(secureRoute)


module.exports = userRouter;