const express = require("express");
const userRouter = express.Router();
const {loginUser,signUp,secureRoute,verifyCode,sendCode} = require("../controllers/userController");

userRouter.route("/sendCode").post(sendCode)
userRouter.route("/verifyCode").post(verifyCode)
userRouter.route("/login").post(loginUser)
userRouter.route("/signup").post(signUp)
userRouter.route("/secure-route").get(secureRoute)



module.exports = userRouter;