var express = require('express');

const session = require('express-session');      
const bodyParser = require('body-parser');   
const http = require('http');
var router = express.Router();
var mongoose = require('mongoose');
const crypto = require('crypto');
const multer = require('multer');   
const methodOverride = require('method-override');  
var cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt")
const _ =require("lodash");
const jwt=require('jsonwebtoken');
const passport = require('passport');
var fs = require('fs-extra');
var fs1 = require('fs');
const passportJWT =require("passport-jwt");
const ExtractJwt =passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'SKILLCHAIN';
const path=require('path');

const tinify = require("tinify");
tinify.key = "bc79YJm0G83kgF5wgw0Bdv8N52Dvc0FT";

const imageToBase64 = require('image-to-base64');

const TWO_HOURS = 1000*60*60*2;
router.use(methodOverride('_method'));
router.use(bodyParser.json());
router.use(cookieParser());
const url = 'mongodb://127.0.0.1:27017/skillchain?retryWrites=true&w=majority';
const util = require('util');
var upload = multer({
    limits: { fileSize: 2000000 },
    dest: __dirname + '/uploads/images'
});


var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'environment.save.2020@gmail.com',
        pass: 'Happiness9'
    }
});


const{
    NODE_ENV ='development',
    SESS_SECRET = 'SKILLINDIA/SKILLCHAIN!12128j8jdnfnir', 
    SESS_LIFETIME = TWO_HOURS
  }=process.env
  // view engine setup (Middleware)
  
  const IN_PROD = NODE_ENV === 'production'
    router.use(session({
    name : 'Environment',
    resave : true,
    saveUninitialized : false,
    secret : SESS_SECRET,
    cookie : {
      maxAge : SESS_LIFETIME,
      sameSite : true,
      secure : IN_PROD
  
    }
  }));

router.get('/error', function(req,res){
    res.render('error',{title : "Error"});
});
router.get('/upload',function(req,res){
   if(req.session.email&& req.session.type=="environment"){
    res.render('upload');

   }
    else{
res.render('index');
    }    
});

// var Storage=


var st="";

router.post('/profileimage',multer({
    storage: multer.diskStorage({
        destination:"./routes/uploads/images",
        filename: (req,file,cb)=>{
             st=file.fieldname+"_"+req.session.email+"_"+path.extname(file.originalname)
            cb(null,st);
        }
    })
}).single('file'),function(req,res){



// console.log(st);
// console.log(Date.now());

    var m=st.split("_"); 
    var id="";
    id=m[1];
   var Count=0;
    try{
        MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
        if (err){
         res.render('error',{title : err});}
        db = client.db('environment') 
        db.collection('postcount').findOne({ Name : id })
        .then(item => {
            // console.log(item);
                if(item!=null){
                    Count=item.count;
                Count=Count+1;
                        db.collection("postcount").updateOne({_id : item._id}, { $set: {count : Count} }, function(err, res) {
                            if (err) res.render('error',{title : err});
                            
                        });
                }
                else{
                    var newItem={
                        Name : id,
                        count: 0
                    }
                    db.collection('postcount')
                    .insertOne(newItem, function(err, result) {
                        if (err) { res.render('error',{title : err});
                        }   
                        // console.log("new entry inserted "+st);
                    });
                }
            })
        })
    }
    catch(e){
    console.log(e);
    }
    var des=m[0]+"_"+m[1]+"_0"+m[2];
    setTimeout(function() {
    const source = tinify.fromFile("./routes/uploads/images/"+st);
   
      source.toFile(des);

  console.log(des+"     des");
  
        const pathToFile = "./routes/uploads/images/"+st;
    
    fs1.unlink(pathToFile, function(err) {
      if (err) {
        throw err
      } else {
        console.log("Successfully deleted the file.")
      }
    })
      var success=req.file.filename+" uploaded successfuly";
      res.render('success',{ title: success});
    }, 2000);
  
    setTimeout(function() {
     
          st=m[0]+"_"+m[1]+"_0"+m[2];
            console.log(Count);
        
          imageToBase64("/home/blockchain/fabric-dev-servers/case-studies/skillchain_v2/skillchain-app/"+des) // you can also to use url
          .then(
              (response) => {
      
                  try{
                      MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
                      if (err){
                       res.render('error',{title : err});}
                      db = client.db('environment') 
                      console.log(Count);
                      des=m[0]+"_"+m[1]+"_"+Count+".png";
                                  var newItem={
                                      Name : des,
                                      Filename : req.session.name,
                                      Eventdate : req.body.date,
                                      Eventtime : req.body.time,
                                      Message :  req.body.message,
                                      Address : req.body.address,
                                      State : req.body.state,
                                      City : req.body.city,
                                      District : req.body.district,
                                      Uploadtime : Date.now(),
                                      image : response,
                                      Likes : 0,
                                      Dislikes : 0
                                  }
                                  db.collection('imagedata')
                                  .insertOne(newItem, function(err, result) {
                                      if (err) { res.render('error',{title : err});
                                      }   
                                    //   console.log("new image inserted "+des);
                          
                                  });
                              })
                  }
                  catch(e){
                  console.log(e);
                  }
      
                  
              }
            
          )
          .catch(
              (error) => {
                  console.log(error); //Exepection error....
              }
          )
          const pathTo = "./"+st;
    
          fs1.unlink(pathTo, function(err) {
            if (err) {
              throw err
            } else {
            //   console.log("Successfully deleted the file.")
            }
          })
    }, 80000);
});






router.get('/success',function(req,res){
    res.render('success');  
})
router.get('/users',function(req,res){
    try{
        var user;
        MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
        if (err){
         res.render('error',{title : err});}
        db = client.db('environment') // whatever your database name '
        db.collection('userdata').findOne({ Users : "users"})
        .then(item => {
                if(item!=null){
                    if(item.user){
                        user=item.user;
                        user=user+14;
                        db.collection("userdata").updateOne({_id : item._id}, { $set: {user : user} }, function(err, res) {
                            if (err) res.render('error',{title : err});
                        });
                        res.render('users', {title : user});
                    }
                    else{
                        res.render('error');
                    }
                   
                }
            })
        })
    }
    catch(e){
    console.log(e);
    }
});
router.get('/posts',function(req,res){

    try{
        var posts;
        MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
        if (err){
         res.render('error',{title : err});}
        db = client.db('environment') // whatever your database name '
        db.collection('postdata').findOne({Posts : "posts"})
        .then(item => {
                if(item!=null){
                    if(item.post){
                        posts=item.post;
                        posts=posts+14;
                        db.collection("postdata").updateOne({_id : item._id}, { $set: {post : posts} }, function(err, res) {
                            if (err) res.render('error',{title : err});
                        });
                        res.render('posts', { title : posts});
                    }
                    else{
                        res.render('error');
                    }
                   
                }
            })
        })
    }
    catch(e){
    console.log(e);
    }  
});

router.get('/events',function(req,res){
    try{
        var event;
        MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
        if (err){
         res.render('error',{title : err});}
        db = client.db('environment') // whatever your database name '
        db.collection('eventdata').findOne({Events : "events"})
        .then(item => {
                if(item!=null){
                    if(item.event){
                        event=item.event;
                        event=event+3;
                        db.collection("eventdata").updateOne({_id : item._id}, { $set: {event : event} }, function(err, res) {
                            if (err) res.render('error',{title : err});
                        });
                        res.render('events', { title : event});
                    }
                    else{
                        res.render('error');
                    }
                   
                }
            })
        })
    }
    catch(e){
    console.log(e);
    }  
  
});

router.get('/ongoingevents',function(req,res){
    try{
        var ongoing;
        MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
        if (err){
         res.render('error',{title : err});}
        db = client.db('environment') // whatever your database name '
        db.collection('ongoingdata').findOne({ Ongoing : "ongoing"})
        .then(item => {
                if(item!=null){
                    if(item.ongoing){
                        ongoing=item.ongoing;
                        ongoing=ongoing+1;
                        db.collection("ongoingdata").updateOne({_id : item._id}, { $set: {ongoing : ongoing} }, function(err, res) {
                            if (err) res.render('error',{title : err});
                        });
                        res.render('ongoingevents', { title : ongoing});
                    }
                    else{
                        res.render('error');
                    }
                   
                }
            })
        })
    }
    catch(e){
    console.log(e);
    }  
     
});

router.get('/getallposts',function(req,res){

    try{
        var posts;
        MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
        if (err){
         res.render('error',{title : err});}
        db = client.db('environment') // whatever your database name '
        db.collection("imagedata").find({}).toArray(function(err, result) {
       var obj=[];
            result.forEach(element => { 
                var data={
                    Name : element.Name,
                    Filename : element.Filename,
                    Eventdate : element.Eventdate,
                    Eventtime : element.Eventtime,
                    Message :  element.Message,
                    Uploadtime : element.Uploadtime,
                    Address : element.Address,
                    State : element.State,
                    City : element.City,
                    District : element.District,
                    image: element.image,
                    likes: element.Likes,
                    dislikes : element.Dislikes
                }
                obj.push(data);
              });  
              
              res.send({
                  status : 200,
                  data : obj
              })
        })
    })
    }
    catch(e){
    console.log(e);
    }  

});
  


router.get('/getpostcount',function(req,res){

    try{
        var posts;
        MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
        if (err){
         res.render('error',{title : err});}
        db = client.db('environment') // whatever your database name '
        db.collection("postcount").find({}).toArray(function(err, result) {
       var obj=[];
            result.forEach(element => { 
                var data={
                    name : element.Name,
                    Count : element.count
                }
                obj.push(data);
              });  
              
              res.send({
                  status : 200,
                  data : obj
              })
        })
    })
    }
    catch(e){
    console.log(e);
    }  

});


  


router.get('/getalluser',function(req,res){

    try{
        var posts;
        MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
        if (err){
         res.render('error',{title : err});}
        db = client.db('environment') // whatever your database name '
        db.collection("environmentData").find({}).toArray(function(err, result) {
       var obj=[];
            result.forEach(element => { 
                var data={
                    Name : element.FirstName +" "+ element.LastName,
                    Email : element.Email,
                    Password : element.Password,
                    Mobile : element.Number
                }
                obj.push(data);
              });  
              
              res.send({
                  status : 200,
                  data : obj
              })
        })
    })
    }
    catch(e){
    console.log(e);
    }  

});
  
router.get('/getprofileposts',function(req , res){
    if(req.session.email && req.session.type == "environment"){

        try{
            MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
            if (err){
             res.render('error',{title : err});}
            db = client.db('environment') // whatever your database name 
            
            db.collection("imagedata").find({}).toArray(function(err, result) {
                var obj=[];
                var t="file_"+req.session.email+"_.png";
                     result.forEach(element => { 
                        var m=element.Name.split("_");
                        var k=m[0]+"_"+m[1]+"_.png";
                         if(k===t){
                             
                         var data={
                             Name : element.Name,
                             Filename : element.Filename,
                             Eventdate : element.Eventdate,
                             Eventtime : element.Eventtime,
                             Message :  element.Message,
                             Uploadtime : element.Uploadtime,
                             Address : element.Address,
                             State : element.State,
                             City : element.City,
                             District : element.District,
                             image: element.image,
                             likes: element.Likes,
                             dislikes : element.Dislikes
                         }
                         obj.push(data);
                        }
                       });  
                       
                       res.send({
                           status : 200,
                           data : obj
                       })
                 })
                })
        }
        catch(e){
        console.log(e);
        }

    }
    else
    res.render('index');
});


router.get('/like/:id', function(req,res){
    try {
        MongoClient.connect(url,{useNewUrlParser: true},function(err,client){
            if(err){
                return res.render('error',{title : err});
            }
            else{
                db= client.db('environment')
                db.collection('imagedata').findOne({Name: req.params.id})
                .then(item =>{
                    if(item!=null){
                       
                            db.collection("imagedata").updateOne({_id : item._id}, { $set: {Likes : item.Likes +1} }, function(err, res) {
                                if (err) res.render('error',{title : err});
                            });
    
                        res.send({
                            likes: item.Likes +1
                        })
                            
                        }
                        else{
                            res.redirect('/index');

                        }
                    })
                
            }
        });
    } 
    catch (error) {
        res.render('error',{title : error});
        }
});




router.get('/dislike/:id', function(req,res){
    try {
        MongoClient.connect(url,{useNewUrlParser: true},function(err,client){
            if(err){
                return res.render('error',{title : err});
            }
            else{
                db= client.db('environment')
                db.collection('imagedata').findOne({Name: req.params.id})
                .then(item =>{
                    if(item!=null){
                       
                            db.collection("imagedata").updateOne({_id : item._id}, { $set: {Dislikes : item.Dislikes +1} }, function(err, res) {
                                if (err) res.render('error',{title : err});
                            });

                        res.send({
                            dislikes: item.Dislikes +1
                        })
                            
                        }
                        else{
                            res.redirect('/index');

                        }
                    })
                
            }
        });
    } 
    catch (error) {
        res.render('error',{title : error});
        }
});

router.get('/login', function(req,res){
res.render('login');
});


router.get('/index', function(req,res){
    res.render('index');

    });

    router.get('/admin', function(req,res){
       if(req.session.email && req.session.type=="Admin"){
           res.render('admin');
       }
        });
    
        router.get('/tusers', function(req,res){
            if(req.session.email && req.session.type=="Admin"){
                res.render('tusers');
            }
             });

             
        router.get('/image', function(req,res){
            if(req.session.email && req.session.type=="Admin"){
                res.render('image');
            }
             });

     
             router.get('/tpostcount', function(req,res){
                if(req.session.email && req.session.type=="Admin"){
                    res.render('tpostcount');
                }
                 });
    
                 router.get('/totalusers', function(req,res){
                    if(req.session.email && req.session.type=="Admin"){
                        res.render('totalusers');
                    }
                     });
        
        
router.get('/main', function(req,res){
    if(req.session.email && req.session.type == "environment"){
    res.render('main');
    }
    else{
        res.render('error',{title:" You need to login first"})
    }
    });

    router.get('/profile', function(req,res){
        if(req.session.email && req.session.type == "environment"){
        res.render('profile');
        }
        else{
            res.render('error',{title:" You need to login first"})
        }
        });

router.get('/register', function(req,res){
    res.render('register');
    });


    router.post('/signup',function(req,res){

        try{
       
                MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
                    if (err) return res.render('error',{title : err});
                    db = client.db('environment');
                    db.collection('environmentData').findOne({Email : req.body.InputEmail })
                    .then(item =>{
                        if(item==null){
                                
                            bcrypt.genSalt(10, function (err, salt) {
                                if (err) {
                                    res.render('error',{title : err});
                                }
                                else {
                                    bcrypt.hash(req.body.InputPassword, salt, function(err, hash) {
                                        if (err) {
                                            res.render('error',{title : err});
                                        }
                                        else {
                                            var newItem = {
                                                FirstName : req.body.FirstName,
                                                LastName: req.body.LastName,
                                                Email: req.body.InputEmail,
                                                Password: hash,
                                                Verified : false,
                                                Number : req.body.number,
                                                token : "null"
                                            };      
                                            var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
                                        
                                            if (newItem) {
                                                next(null, user);
                                            } 
                                            else {
                                                next(null, false);
                                            }
                                            });
                                            passport.use(strategy);
                                            var payload = {id: newItem.id};
                                            var token = jwt.sign(payload, jwtOptions.secretOrKey);
                                                
                                            newItem.token=token;
                                          
                                            var con = 'http://122.176.120.160:5001/confirm/'+newItem.token;
                                            var mailOptions = {
                                                    from: '"Our Environment " <environment.save.2020@gmail.com>', // sender address (who sends)
                                                    to: req.body.InputEmail , // list of receivers (who receives)
                                                    subject: 'Hello', // Subject line
                                                    text: 'Hello  '+ req.body.FirstName , // plaintext body
                                                    html: '<b>Hello  '+req.body.FirstName+'</b><br> Please click on the link to verify your email address <br> <a href="'+ con+'">'+'Verify</a>' // html body
                                            };
    
                                            transporter.sendMail(mailOptions, function(error, info){
                                                if(error){
                                                    res.render('error',{title : error});
                                                }
                                                db.collection('environmentData')
                                                .insertOne(newItem, function(err, result) {
                                                    if (err) { res.render('error',{title : err});
                                                    }   
                                                });
                                                db.collection('environmentData').findOne({ Email: req.body.InputEmail})
                                                .then(item => {
                                                        
                                                })
                                                .catch(err => {
                                                    res.render('error',{title : err});
                                                });
                                                res.render('success', { title: "Email verification Message sent " });
                                            });
                                        }
                                    })
                                }
                            })
                        }
                        else
                        res.render('error',{title : "User already exists , if you have forgotten your password please reset it using the forgot password button " });
                        });
                });
    
            }
            catch (error) {
                res.render('error',{title : error});
                }
    });
    
    

    router.post('/login', function(req,res,next){

        if(req.session.email && req.session.type=="environment"){
            res.render('main');
        }
        else if(req.body.InputEmail=="admin@gmail.com"&& req.body.InputPassword=="admin"){
            req.session.email="Admin";
            req.session.type="Admin";
                res.render('admin');
            }
else{
        try{
            MongoClient.connect(url,{useNewUrlParser: true} , function(err, client) {
            if (err){
             res.render('error',{title : err});}
            db = client.db('environment') // whatever your database name 
            db.collection('environmentData').findOne({Email : req.body.InputEmail })
            .then(item =>{
                    if(item!=null){
                        var x;
                        try{
                        x=item.Verified;
                        }
                        catch(error){
                            res.render('error',{title : error});
                        }
                        if(x === false){
                        res.render('success', { title : "Please verify your email address first"});
                        }
                        else{
                            bcrypt.compare(req.body.InputPassword, item.Password , function(err, isMatch) {
                                if (err) {
                                    res.render('error',{title : err});
                                }
                                else if (!isMatch) {
                                    res.render('error', { title  : "User Not Found/Password doesn't match!"});
                                }
                                else{
                                    req.session.email = item.Number;
                                    req.session.type = "environment" ;
                                    req.session.name=item.FirstName+" "+item.LastName;
                                    res.redirect('/main');
                                }
                            })
                        }
                    }
                    else{
                        res.render('error', {title : "User Not Found/Password dosen't match!"});
                    }  
                });
            });
        }
        catch (error) {
            res.render('error',{title : error});
            }
        }
    });
    router.get('/confirm/:id', function(req,res){
        try {
            MongoClient.connect(url,{useNewUrlParser: true},function(err,client){
                if(err){
                    return res.render('error',{title : err});
                }
                else{
                    db= client.db('environment')
                    db.collection('environmentData').findOne({token : req.params.id})
                    .then(item =>{
                        if(item!=null){
                            var pd = item.Verified;
                            if(pd==false){
                                db.collection("environmentData").updateOne({_id : item._id}, { $set: {Verified : true} }, function(err, res) {
                                    if (err) res.render('error',{title : err});
                                });
        
                            
                                
                                res.redirect('/index');
                            }
                            else{
                                res.redirect('/index');

                            }
                        }
                    })
                }
            });
        } 
        catch (error) {
            res.render('error',{title : error});
            }
    });
    
    
    

module.exports = router;