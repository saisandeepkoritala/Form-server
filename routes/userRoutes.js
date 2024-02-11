const express = require("express");
const userRouter = express.Router();
const {loginUser,signUp,
    secureRoute,verifyCode,
    sendCode,isAlive,getData} = require("../controllers/userController");
    
userRouter.route("/getData").get(getData)
userRouter.route("/isAlive").get(isAlive)
userRouter.route("/sendCode").post(sendCode)
userRouter.route("/verifyCode").post(verifyCode)
userRouter.route("/login").post(loginUser)
userRouter.route("/signup").post(signUp)
userRouter.route("/secure-route").get(secureRoute)



module.exports = userRouter;