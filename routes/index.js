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
    if(req.pictureFor === "article"){
      cb(null, req.time.getTime().toString() + path.extname(file.originalname))
    }else{
    User.findById(req.session.user, (err, user) => {
      cb(null, user.username + req.time.getTime().toString() + path.extname(file.originalname))      
    });
  }}
})
var upload = multer({ storage: storage });
var userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  sex: {type: String, required: true},
  avatar: {type: String, required: false},
  mobile: {type: String, required: true},
})
var User = mongoose.model('User', userSchema);

var articleSchema = new mongoose.Schema({
  author: String,
  name: String,
  text: String,
  image: String,
  date: Date
})
var Article = mongoose.model('Article', articleSchema);

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
        return res.redirect('/');
      }
    });
  }else{
    return res.redirect('/');
  }
}

let setExpireTime = (req, res, next) => {
  switch (req.body.rememberme) {
    case 'on':
      req.session.cookie.maxAge = 1209600000; //2 weeks
      break;
  
    default:
      req.session.cookie.maxAge = 900000; //15 minutes
      break;
  }
  return next();
}

let thisIsAnArticle = (req, res, next) => {
  req.pictureFor = "article";
  req.time = new Date();
  return next();
}

let thisIsAUser = (req, res, next) => {
  req.pictureFor = "user";
  req.time = new Date();
  return next();
}

router.get('/', (req, res, next) => {
  if(!req.session.passport){
    res.render('index', { message: '' });
  }else{
    res.redirect('/dashboard');
  }
});

router.get('/dashboard', isLogedIn, (req, res) => {
  User.findById(req.session.passport.user, (err, user) => {
    res.render('dashboard', {user: {
      username: user.username
    }});
  })
})

router.post('/login', setExpireTime, function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(800).render('index', {message: "incorrect username or password"}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(200).redirect('/dashboard');
    });
  })(req, res, next);
});

router.get('/signup', (req, res) => {
  res.render('signup', {message: ""});
})

router.post('/signup', thisIsAUser, upload.single('img'), (req, res) => {
  let {firstName, lastName, username, password, password2, sex, mobile} = req.body;
  if(!firstName || !lastName || !username || !password || !password2 || !sex || !mobile){
    res.status(801);
    res.render('signup', {message: 'fill all boxes'});
  } else if(password !== password2){
    res.status(802);
    res.render('signup', {message: "passwords dosen't match"})
  } else if(password.length <= 5){
    res.status(803);
    res.render('signup', {message: 'your password must be longer than 5 characters'})
  } else {
    User.findOne({username: username}, (err, user) => {
      if(user){
        res.status(804);
        res.render('signup', {message: 'username already taken'});
      }else{
        if(!req.file){
          let newUser = new User({firstName, lastName, username, password, sex, mobile,
            avatar: path.join(__dirname + '/../public/images/avatar.jpg')});
          newUser.save();
          res.status(201);
          res.render('index', {message: 'registered successfuly'})
        }else{
          let newUser = new User({firstName, lastName, username, password, sex, mobile,
            // avatar: path.join(__dirname + '/../public/images/' 
            //                             + user.username 
            //                             + req.time.getTime().toString() 
            //                             + path.extname(req.file.originalname)
            // )
          });
          newUser.save();
          res.status(201);
          res.render('index', {message: 'registered successfuly'})
        }
      }
    })
  }
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

router.get('/newarticle', isLogedIn, (req, res) => {
  res.render('articleEditor');
})

router.post('/newarticle', isLogedIn, thisIsAnArticle, upload.single('articleimage'), (req, res) => {
  console.log(req.file);
  
  if(req.body.articlename === ""){
    res.locals.message = "article must have a name";
    res.status(801).render('articleEditor');
  }else if(req.body.articletext.length < 10){
    res.locals.message = "an article is longer than a tweet";
    res.status(805).render('articleEditor');
  }else if(!req.file){
    res.locals.message = "an article must have a picture";
    res.status(805).render('articleEditor');
  }else{
    User.findById(req.session.passport.user, (err, user) => {
      let posted = new Article({author: user.username,
                                text: req.body.articletext, 
                                image: req.time.getTime().toString() + path.extname(req.file.originalname),
                                date: req.time,
                                name: req.body.articlename
                              });
      posted.save();
      res.status(201).redirect('/dashboard');
    })
  }
})

router.post('/articles', (req, res) => {
    Article.find({}, null, { sort: { date: -1 } }, function(err, docs) {
        res.status(200).json({
            articles: docs.slice(req.body.from * 10, req.body.from * 10 + 10)
        });
    });
});

router.post('/userArticles', (req, res) => {
  Article.find({author: req.body.author}, null, {sort: {date: -1}}, function(err, articles) {
    res.status(200).json({articles: articles})
  });
})

router.post('/theArticle', (req, res) => {
  Article.findById(req.body.id, function(err, article) {
    res.status(200).json({article: article});
  });
})

router.post('/userEverything', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) =>{
    Article.find({username: req.body.username}, (error, articles) => {
      res.status(200).json({
        articles: articles,
        info: user
      });
    })
  })
})

router.post("/editInfo", (req, res) => {
  let {username, password, firstName, lastName, mobile} = req.body;
  User.findOne({username}, (err, user) => {
    if(!user){
      User.findByIdAndUpdate(req.session.passport.user, {$set: {username, password, firstName, lastName, mobile}}, (err, user) => {
        Article.update({author: user.username}, {$set: {author: username}}, () => {
          res.status(202).end();
        })
      })
    }else{
      res.status(804).end();
    }
  })
})

module.exports = router;
