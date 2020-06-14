
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session');  
const methodOverride = require('method-override');  
const index = require('./routes/main');

const TWO_HOURS = 1000*60*60*2;
const app = express();
app.set('views', path.join(__dirname, 'publicdemo'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());



app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'publicdemo')));
app.use('/',index);


const{
    NODE_ENV ='development',
    SESS_SECRET = 'SKILLINDIA/SKILLCHAIN!12128j8jdnfnir', 
    SESS_LIFETIME = TWO_HOURS
  }=process.env
  // view engine setup (Middleware)
  
//   const IN_PROD = NODE_ENV === 'production'
//     app.use(session({
//     name : 'Skillchain',
//     resave : false,
//     saveUninitialized : false,
//     secret : SESS_SECRET,
//     cookie : {
//       maxAge : SESS_LIFETIME,
//       sameSite : true,
//       secure : IN_PROD
  
//     }
//   }));


app.get('/', function(req,res,next){
res.render('index');
});


app.get('/logout',function(req,res){
    req.session.destroy();
    res.render('index');
});





const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
