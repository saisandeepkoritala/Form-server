const express = require("express");
const userRouter = express.Router();
const {loginUser,signUp,
    secureRoute,verifyCode,
    sendCode,isAlive,getData,getData1} = require("../controllers/userController");

    const authToken =async(req,res,next)=>{
        try{    
            let array = req.headers.cookie.split(";")
            let accessToken = null;
            for (let element of array) {
                if (element.includes('Access_token=')) {
                    accessToken = element.split('=')[1];
                    break;
                }
            } 
            if (accessToken) {
                req.token=accessToken;
            } else {
                console.log("Access token not found.");
            }
            next()
        }
        catch(e){
            res.json({
                status:"fail",
                message:"no cookie found"
            })
        }
    }

userRouter.route("/getData").get(authToken,getData)
userRouter.route("/getData1").post(getData1)


userRouter.route("/isAlive").get(isAlive)
userRouter.route("/sendCode").post(sendCode)
userRouter.route("/verifyCode").post(verifyCode)
userRouter.route("/login").post(loginUser)
userRouter.route("/signup").post(signUp)
userRouter.route("/secure-route").get(secureRoute)



module.exports = userRouter;