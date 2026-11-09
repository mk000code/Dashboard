const express = require('express')
const router=express.Router()
const bcrypt = require('bcryptjs');
const User=require('../models/user');

const jwt=require('jsonwebtoken');

router.post('/register',async (req,res)=>{

    try{
    const {name,email,password,role}=req.body;

    if(!name||!email||!password){
        return res.status(400).json({
            message:"Fields required"
        })
    }

     if(password.length<6){
        return res.status(400).json({
            message:"Password must be Atleast 6 character Long"
        })
    }


    const existingUser =await User.findOne({
         email: email.toLowerCase().trim()
    })

    if(existingUser){
        return res.status(200).json({
            messgae:"User Already exist"
        })
    }

   
    const hashedPassword = await bcrypt.hash(password,15);

    const newUser =await User.create({
        name,
        email,
        password:hashedPassword,
        role
    })

          res.status(201).json({

            message: "Registration successful",

            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }

        });

}catch(error){

    if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        res.status(500).json({
            message: error.message
        });

}
})


router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user and explicitly include password
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not configured" });
        }

        const token = jwt.sign(

            {
                id: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '1d'
            }

        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({

            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error("Login error:", error);
        res.status(500).json({
            message: error.message
        });

    }

});

router.post('/logout', (req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax'
    });

    res.json({
        message: "Logout successful"
    });
});

module.exports = router;
