var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// var userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   firstName: String,
//   lastName: String,
//   sex: Number,
//   avatar: String,
//   mobile: Number
// })
var User = mongoose.model('User');
/* GET users listing. */
router.get('/', async function (req, res, next) {
    let editable = false;
    await User.findById(req.session.passport.user, (err, user) => {
        if (req.query.user === user.username) {
            editable = true;
        }
    })
    User.findOne({ username: req.query.user }, (err, user) => {
        console.log(user.mobile);
        
        res.render('profile', {
            user: {
                username: user.username,
                fname: user.firstName,
                lname: user.lastName,
                avatar: user.avatar,
                mobile: user.mobile
            },
            editable
        })
    })
});

module.exports = router;