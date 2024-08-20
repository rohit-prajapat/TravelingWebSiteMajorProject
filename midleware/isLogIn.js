module.exports =  isLogin = (req,res,next)=>{
   
    if(!req.isAuthenticated())
    {
        console.log("not authenticate : ");
        // flash("not authenticate : ");
        
        return res.redirect("/listings");
    }
    next();
}