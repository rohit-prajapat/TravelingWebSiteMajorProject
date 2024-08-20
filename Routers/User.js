const express = require("express");
const router = express.Router({mergeParams : true});
const User = require('../Model/User.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");


router.get("/signup",(req,res)=>{
    console.log(req.user);
    // res.send("singup :");
    res.render('User/singup.ejs');
})


router.post('/singup',async (req,res)=>{
    
    // console.log(req.body.User);
    try{
        let {username,email,password} = req.body.User;
    console.log(email);
    const newUser = new User({email, username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);

    req.flash('success','welcome to our website');
    res.redirect('/listings');
    }
    catch(err){

        req.flash('error',err.message);
        res.send(err);
        res.redirect('/user/signup');
    }
})


router.get("/login",(req,res)=>{
    res.render('User/login.ejs');
})


router.post('/login', 
    passport.authenticate('local', { 
        failureRedirect: '/user/login', 
        failureFlash: true 
    }), 
    (req, res) => {
        
        console.log(req.user);
       return res.redirect('/listings');
       
    }
);




module.exports = router;