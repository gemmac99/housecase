const express = require("express")
const bodyparser = require("body-parser")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const path = require("path")
const app = express()
const mongoose = require("mongoose")
const fs = require("fs")
const multer = require("multer")
const User = require("./models/users.js").User //.Student   but since 1 model lang
const Posts = require("./models/posts.js").Posts

'use strict';
var crypto = require('crypto');

const urlencoder = bodyparser.urlencoded({
    extended:false 
})

const UPLOAD_PATH = path.resolve(__dirname, "uploads")
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize : 10000000,
    files : 2
  }
})

mongoose.connect("mongodb://localhost/student-db", {
    useNewUrlParser: true
})

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: "very secret",
    resave: false, 
    saveUninitialized: true, 
    cookie:{
        maxAge: 1000 * 60 * 60
    }  
}))

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};


var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}

function getSalt(){
    var salt = genRandomString(16);
    return salt;
}

function getHash(userpassword, salt){
    var hash = sha512(userpassword,salt);
    return hash.passwordHash;
}


app.get("/", function(req,res){
    if(req.session.username){
        //if user is signed in 
        // go to home.html
        res.render("homepage.hbs", {
            username: req.session.username 
        })
    }else{  
        //if user is not signed in
        res.render("landing.hbs", {})
        }
})
/* 
- greet the user with their username 
- 3 errors 
    - [reg] enter a username and password 
    - [reg] username already taken 
    - [login] username and password does not match 
- remember existing/registered users 
*/ 

app.post("/searchresult", urlencoder, function(req,res){  //our current search rn
    let input = req.body.srchbar
    var result = [] //storing for later on
    const regex = new RegExp(input,'gi'); //makes regex allows for "like" query
    Posts.find({title: regex}).then((docs)=>{
        if(docs == null || docs.length == 0){
            console.log("No results found.")
            res.redirect("/")
            //if post
        }else{
            result = docs

            res.render("searchresults.hbs", {
                Posts:docs
            })
        }
    })
    /*
    Posts.find({title: regex},function(err,arr){
        if(err){
            console.log(err);
        }else{
            console.log("title: " + arr[0].title);
            for(const i of arr){
                res.render("searchresults.hbs", {
                    title: arr[i].title

                })
            }
        }
    }) */
})

app.post("/register", urlencoder, function(req,res){
    let username = req.body.un
    let password = req.body.pw 
    if(username == "" || password == ""){
        // send error 
        res.render("login.hbs", {
            regerror: "Enter a username and password"
        })
    }else if (User.exists({username: req.body.un}).then((doc)=>{
            console.log("exists doc:  "+doc);
            if(doc == true){
                res.render("login.hbs", {
                    regerror: "Username already taken"
                })
            }else{ //if everything is correct
                // if req.session.username is defined, the user is signed in 
                req.session.username = req.body.un 

                useSalt = getSalt();
                useHash = getHash(password, useSalt);
                //saltHashPassword(password)
                usersalt = useSalt;
                userhash = useHash;
                let users = new User ({
                    username: username,
                    salt: usersalt,
                    hash: userhash
                })
                users.save().then((doc)=>{
                    console.log("Successfully added: " + doc)
                }, (err)=>{
                    console.log("Error in adding: " + doc)
                })


                res.redirect("/")
            }
        })
    ){
        console.log("this shud work")
    }
})

app.post("/login", urlencoder, function(req,res){
    
    inputpw = req.body.pw; //input password
    inputun = req.body.un;

    User.findOne({username:inputun}).then((docs)=>{
        if(docs==null){
            res.render("login.hbs", {
                loginerror: "User does not exist"
            })
        }else{
            User.findOne({username:inputun}).then((docs) =>{  //getting salt from db
                dbsalt = docs.salt 
                dbhash = docs.hash
                newhash = getHash(inputpw, dbsalt);
                if(dbhash == newhash){
                    req.session.username = req.body.un
                    res.redirect("/")
                }else{
                    res.render("login.hbs",{
                        loginerror: "username and password does not match"
                    })
                }
            })

           
        }
    })
})


// going to logout
app.get("/logout", (req, res)=>{
    req.session.destroy()
    res.redirect("/")
})
// going to Submission
app.get("/submission", (req, res)=>{
    res.render("submission.hbs", {
        username: req.session.username
    })
    
})
// going to homepage
app.get("/home",(req, res)=>{
    res.redirect("/")
})
app.get("/login", (req, res)=>{
    res.render("login.hbs", {})
    
})

app.get("/searchresults", (req,res) =>{
    res.render("searchresults.hbs", {})
})
//SUBMISSION FORM GETTING DATA (Don't know where to put this if this should be inside the .get in submission)
//need to add the picture as well not yet there
app.post("/addsubmission",upload.single("avatar-file") ,(req, res)=>{
    let title = req.body.title
    let username = req.body.un
    let email = req.body.email
    let dLink = req.body.dlink
    let description = req.body.description
    let filename = req.file.filename
    let originalfilename = req.file.originalname
    
    let posts = new Posts({
        title: title,
        username: username,
        email: email,
        dLink: dLink,
        description: description,
        filename: filename,
        originalfilename: originalfilename
    })
    posts.save().then((doc)=>{
        console.log("Successfully added: " + doc)},
        (err)=>{
            console.log("Error in adding: " + doc)
        })
    res.render("submission.hbs")  
})



//going to userprofile
app.get("/userprofile",(req, res)=>{
    Posts.find({username:req.session.username}).then((docs)=>{
        res.render("userprofile.hbs",{
            username: req.session.username,
            Posts:docs
            //Viewing of the submitted houses should be here depending on the DB sorry i dont know the syntax
        })
    }) 
})

app.get("/viewpost:_id",(req, res)=>{
    let posts = {}
    Posts.find({'_id':req.params._id}).then((docs)=>{
        posts.posts = docs
        res.render("viewpost.hbs", posts)
        console.log(posts)
    })
    
})
// this should be in controller post
app.get("/uploads/:_id", (req, res)=>{
    console.log(req.params._id)
    Posts.findOne({_id: req.params._id}).then((doc)=>{
      fs.createReadStream(path.resolve(UPLOAD_PATH, doc.filename)).pipe(res)
    }, (err)=>{
      console.log(err)
      res.sendStatus(404)
    })
  })
  
app.get("/delete:_id",(req,res)=>{
    Posts.remove({'_id':req.params._id}).then((doc)=>{
        res.render("homepage.hbs",{username: req.session.username})
    })
    
})

app.listen(3000, function(){
    console.log("Now listening to port 3000")
})