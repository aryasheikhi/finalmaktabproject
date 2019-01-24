var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + '/../public/images'))
  },
  filename: function (req, file, cb) {
    User.findById(req.session.passport.user, (err, user) => {
        cb(null, user.username + path.extname(file.originalname))      
    });
  }
})
var upload = multer({ storage: storage });
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastname: String,
  sex: Number,
  avatar: String,
  mobile: Number
})
var User = mongoose.model('User', userSchema);
// db.once('open', function() {
//   let test = new User({username: 'test', password: 'test',
//   firstName: 'test',
//   lastname: 'test',
//   sex: 0,
//   mobile: 9123456789});
//   // test.save();
//   User.find((err, result) => {
//     console.log(result)
//   })
// });

var sessionSchema = new mongoose.Schema({
  "expires" : Date,
  "session" : String
})
var Sessions = mongoose.model('sessions', sessionSchema);


passport.use('local-login', new LocalStrategy((username, password, done) => {
  User.findOne({username : username}, function (err, user) {
      if (err){return done(err);}
      if (!user){return done(null, false);}
      if (user.password !== password){return done(null, false);}
      return done(null, user);
  })
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
      done(err, user);
  });
});


let isLogedIn = (req, res, next) => {
  if(req.session.passport){
    let id = req.session.passport.user;
    User.findById(id, (err, user) => {
      if (user) {
        return next();
      } else {
        return res.sendStatus(404);
      }
    });
  }else{
    return res.sendStatus(404);
  }
}

let setExpireTime = (req, res, next) => {
  if(req.body.rememberme === 'on'){
    req.session.cookie.maxAge = 14 * 24 * 3600000; //2 weeks
  }else{
    req.session.cookie.maxAge = 15 * 60000;
  }
  return next();
}



/* GET home page. */
router.get('/', (req, res, next) => {
  if(!req.session.passport){
    res.render('index', { message: '' });
  }else{
    res.redirect('/dashboard');
  }
});

router.get('/dashboard', isLogedIn, (req, res) => {
  User.findById(req.session.passport.user, (err, user) => {
    res.render('dashboard', {username: user.username});
  })
})

router.post('/login', setExpireTime, passport.authenticate('local-login', { failureRedirect: '/', successRedirect: '/dashboard' }), )

router.get('/signup', (req, res) => {
  res.render('signup', {message: ""});
})

router.post('/signup', upload.single('img'), (req, res) => {
  let {firstName, lastName, username, password, password2, sex, mobile} = req.body;
  if(firstName === '' 
  || lastName === '' 
  || username === '' 
  || password === '' 
  || password2 === '' 
  || sex === undefined 
  || mobile === ''){
    res.render('signup', {message: 'fill all boxes'});
  }
  if(password !== password2){res.render('signup', {message: "passwords dosen't match"})}
  if(password.length <= 5){res.render('signup', {message: 'your password must be longer than 5 characters'})}
  User.findOne({username: username}, (err, user) => {
    if(user){
      res.render('signup', {message: 'username already taken'});
    }else{
      if(!req.file){
        let newUser = new User({firstName, lastName, username, password, sex, mobile,
          avatar: path.join(__dirname + '/../public/images/avatar.jpg')});
        newUser.save();
      }else{
        let newUser = new User({firstName, lastName, username, password, sex, mobile,
           avatar: path.join(__dirname + '/../public/images/' + req.file.originalname)});
        newUser.save();
        res.render('index', {message: 'registered successfuly'})
      }
    }
  })
})

router.get('/logout', isLogedIn, (req, res) => {
  let id = req.session.passport.user;
  Sessions.find({}, (err, result) => {
    result.map(item => {
      if(item.session.includes(id)){
        Sessions.deleteOne({id : item._id}, () => {});
      }
    })
  }).then(() => {
    res.clearCookie('connect.sid');
        res.redirect('/');
  })
})

router.get('/newarticle', (req, res) => {
  res.render('articleEditor');
})

module.exports = router;
