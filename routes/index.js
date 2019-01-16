var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastname: String,
    sex: Number,
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


passport.use('local-login', new LocalStrategy(function (username, password, done) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (user.password !== password) {
            return done(null, false);
        }
        return done(null, user);
    })
}))

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


function isLogedIn(req, res, next) {
    if (req.session.passport.user) {
        let id = req.session.passport.user;
        User.findById(id, function (err, user) {
            if (user) {
                return next();
            } else {
                return res.sendStatus(404);
            }
        });
    } else {
        return res.sendStatus(404);
    }

}



/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        message: ''
    });
});

router.get('/dashboard', isLogedIn, (req, res) => {
    User.findById(req.session.passport.user, (err, user) => {
        res.render('dashboard', {
            username: user.username
        });
    })
})

router.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/',
    successRedirect: '/dashboard'
}))

router.get('/signup', (req, res) => {
    res.render('signup', {
        message: ""
    });
})

router.post('/signup', (req, res) => {
    let {
        firstName,
        lastName,
        username,
        password,
        password2,
        sex,
        mobile
    } = req.body;
    console.log(firstName, lastName, username, password, password2, sex, mobile)
    if (firstName === '' ||
        lastName === '' ||
        username === '' ||
        password === '' ||
        password2 === '' ||
        sex === undefined ||
        mobile === '') {
        res.render('signup', {
            message: 'fill all boxes'
        });
    }
    if (password !== password2) {
        res.render('signup', {
            message: "passwords dosen't match"
        })
    }
    if (password.length <= 6) {
        res.render('signup', {
            message: 'your password must be longer than 6 characters'
        })
    }
    User.findOne({
        username: username
    }, (err, user) => {
        if (user) {
            res.render('signup', {
                message: 'username already taken'
            });
        } else {
            let newUser = new User({
                firstName,
                lastName,
                username,
                password,
                sex,
                mobile
            });
            newUser.save();
            res.render('index', {
                message: 'registered successfuly'
            })
        }
    })

})

module.exports = router;