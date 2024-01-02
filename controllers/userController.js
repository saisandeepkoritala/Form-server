const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getToken = (email, password) => {
    return jwt.sign({ email, password }, "MY-SECRET-KEY-TO-HASH-THE-LOGIN");
};

exports.loginUser = async (req, res, next) => {
    try {
        console.log(req.body)
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        const encoded = await user.correctPassword(password, user.password);

        const token = getToken(user.email, user.password);
        console.log(token)
        if (encoded) {
            res
                .cookie("Access_token", token, {
                    // httpOnly: true,
                    // secure: true,
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
                    user: newUser,
                },
            });
    } catch (e) {
        res.status(401).json({
            status: "Fail",
            error: e,
        });
    }
};


exports.secureRoute=async(req,res,next)=>{
    const token = req.cookies.Access_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'MY-SECRET-KEY-TO-HASH-THE-LOGIN', (err, decoded) => {
        if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
        }

        // Attach the decoded payload to the request for further use
        req.user = decoded;
        res.status(200).json({
            status:"success",
            user:req.user
        })
        next();
    });
}