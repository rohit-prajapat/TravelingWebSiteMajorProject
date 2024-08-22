const express = require("express");
const router = express.Router({mergeParams : true});
const User = require('../Model/User.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");


router.get("/signup",(req,res)=>{
    console.log("singup get request",req.user);
    // res.send("singup :");
   return res.render('User/singup.ejs');
})


router.post('/singup',async (req,res)=>{
    
   console.log(req.body);
    try{
        let {username,email,password} = req.body;
        console.log("signup post request : ",username,email,password);
        console.log(email);
        const newUser = new User({email, username});
        const registerUser = await User.register(newUser,password);
        console.log(registerUser);
        
      

            req.login(registerUser, function(err) {  // <-- Use registerUser, not User
                if (err) { 
                    console.log(err);
                    req.flash('error', 'There was an error logging you in.');
                    return res.redirect('/user/login');
                }
    
                req.flash('success', 'Welcome to our website!');
                res.redirect('/listings');
            });
    
        
    }
    catch(err){

        req.flash('error',err.message);
        
        // res.redirect('/user/signup');
        res.send(err)
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

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


module.exports = router;