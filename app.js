
require('dotenv').config()
const dotenv=require('dotenv');
const addemployee=require('./database').insertintoEmployee
const alert=require('alert');
const md5 = require('md5');
const adduser=require('./database').insertNewUser
const userAuth=require('./database').authenticateMyUser
const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const GoggleStrategy=require('passport-google-oauth20').Strategy;
const app=express()
const session=require('express-session')
const passport= require('passport');
app.use(session({secret:"Secret"}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session())
console.log(process.env.clientID);
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(user, done) {
    done(null,user)
  });
  
passport.use(new GoggleStrategy({

    clientID:"952950658003-kalom73ulsje97ojp92m6iubittas48k.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"},
    function(accessToken,refreshToken,profile,cb) {
        console.log(profile.id);
        return cb(null,profile);
    }
    
    ));



app.get('/',(req,res)=>{
    res.render("home")
})

app.get('/login',(req,res)=>{
    res.render('login')
    
})

async function authHelp(username,password) {
  
     let promise=new Promise((resolve)=>{
        if ( userAuth(username,password)==1)
       { console.log("Success")
        resolve(1);}
     })
     const ans=await promise.then((value)=>{
       ans=value;
       return value;
     })
}

app.post('/login/',(req,res)=>{
 
  const username=req.body.username;
  const password=md5(req.body.password);
  
  
 userAuth(username,password,function(result) {
    
  if(result==1)
  res.render('secrets')
  else 
  {
   alert("Sorry Wrong Credentials")
  }
 
     
});

  

});





app.get('/register',(req,res)=>{
    res.render('register')




})
app.post('/register',(req,res)=>{
  console.log(req.body.username)
  addemployee(req.body.employeeId,req.body.dateOfRetirement,req.body.designation,req.body.department,true,req.body.role)
  adduser(req.body.username,md5(req.body.password),req.body.employeeId)
  res.render('secrets')
})

app.get("/auth/google",
 
  passport.authenticate('google', { scope: ["profile","email"] },()=>{
     console.log("Here");
  })
);
app.get('/secrets',(req,res)=>{
    res.render('secrets')
})

app.get("/auth/google/secrets",
  passport.authenticate('google', { successRedirect:"/secrets" ,failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    console.log("success")
    res.redirect("/secrets");
  });
  app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/secrets',
                    failureRedirect : '/'
            }));

            app.get('/auth',passport.authenticate('google',{
                scope:['profile','email']
            }));
app.listen(3000,()=>{
    console.log("server started on http://localhost:3000")
})