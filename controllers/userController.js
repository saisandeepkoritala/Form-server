const User = require("../models/user");
const TempUser = require("../models/tempUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const send = require("../utils/email");

const getToken = (email, password) => {
    return jwt.sign({ email, password }, "MY-SECRET-KEY-TO-HASH-THE-LOGIN");
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        const encoded = await user.correctPassword(password, user.password);

        const token = getToken(user.email, user.password);
        if (encoded) {
            res
                .cookie("Access_token", token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                })
                .status(200)
                .json({
                    status: "success",
                    token,
                    data: {
                        user,
                    },
                });
        } else {
            res.status(400).json({
                status: "Fail",
                error: "error",
                message: "Password not matched",
            });
        }
    } catch (e) {
        res.status(401).json({
            status: "Fail",
            error: "error",
        });
    }
};

exports.signUp = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        });

        const token = getToken(newUser.email, newUser.password);

        await TempUser.deleteOne({email:newUser.email}) 

        res.cookie("Access_token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 2 * 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({
                status: "success",
                token,
                data: {
                    user: newUser,
                },
            });

            if(newUser){

            }
    } catch (e) {
        res.status(401).json({
            status: "Fail",
            error: e,
        });
    }
};


exports.verifyCode=async(req,res,next)=>{
    try{
        const {email,code} = req.body;

        const tempuser = await TempUser.findOne({email:email,
            code:code,expiresIn: { $gt: new Date() }})
        if(tempuser){
            res.status(200).json({
                status:"success",
                message:"verified"
            })
        }
        else{
            res.status(401).json({
                status:"Fail",
                message:"OTP expired"
            })
        }
    }
    catch(e){

    }
}

exports.sendCode=async(req,res,next)=>{
    try{
        const {name,email}=req.body;
        const duplicate= await User.findOne({email})
        if(duplicate){
            res.status(401).json({
                status:"Fail",
                message:"Email already existed"
            })
        }
        else{

            const alreadyTempUser = await TempUser.findOne({email}) 
            if(!alreadyTempUser){
                const message=Math.floor(Math.random()*1000000);
                send({
                    email:`${email}`,
                    subject: "USE THE OTP BELOW",
                    message:`${message}`
                }).then(resp => {
                    res.status(200).json({
                        status:"success",
                        message:"code sent",
                        resp
                    })
                }).catch(error => {
                    res.status(400).json({
                        status:"Fail",
                        message:"Try Again",
                        error
                    })
                });
                const currentDate = new Date();
                const futureDate = new Date(currentDate.getTime() + 10 *60* 1000); 
                const resp = await TempUser.create({
                    name,email,code:message,expiresIn:futureDate
                })

                }
                else{
                    const message= Math.floor(Math.random()*1000000);
                    const currentDate = new Date();
                    alreadyTempUser.expiresIn = new Date(currentDate.getTime() + 10 *60* 1000); 
                    alreadyTempUser.code = message;
                    await alreadyTempUser.save();

                    send({
                        email:`${email}`,
                        subject: "RESENDING OTP",
                        message:`${message}`
                    }).then(resp => {
                        res.status(200).json({
                            status:"success resending",
                            message:"code sent again",
                            resp
                        })
                    }).catch(error => {
                        res.status(400).json({
                            status:"Fail Resending",
                            message:"For some Reason Failed",
                            error
                        })
                    });

                }
        }
    }
    catch(e){
        console.log("hello",e)
    }
}

exports.secureRoute=async(req,res,next)=>{
    const token = req.cookies.Access_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'MY-SECRET-KEY-TO-HASH-THE-LOGIN', (err, decoded) => {
        if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = decoded;
        res.status(200).json({
            status:"success",
            user:req.user
        })
        next();
    });
}