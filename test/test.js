var supertest = require("supertest");
var should = require('should');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    sex: Number,
    avatar: String,
    mobile: Number
})
var sessionSchema = new mongoose.Schema({
    "expires" : Date,
    "session" : String
})
var articleSchema = new mongoose.Schema({
    name: String,
    text: String,
    image: String,
    date: Date
})
var User = mongoose.model('User', userSchema);
var Article = mongoose.model('Article', articleSchema);
var Sessions = mongoose.model('sessions', sessionSchema);
// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:3000");

function loginUser() {
    return function(done) {
        server
            .post('/login')
            .send({ username: 'FaridA', password: '1234567' })
            .expect(302)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    };
};
// UNIT test begin

describe('', function(){
    describe("Signup", function(){
        describe("should not sign a user up when", function(){
            it('some required fields of new user information are not entered', function(done){
                let userInfo = {
                    firstName: '',
                    lastName: '',
                    username: '', 
                    password: '', 
                    password2: '', 
                    sex: undefined, 
                    mobile: null
                }
                server
                .post("/signup")
                .send(userInfo)
                .expect(801)
                .end(done);
            });
    
            it("fields 'password' and 'confirm password' are not matching", function(done){
                let userInfo = {
                    firstName: 'Farid',
                    lastName: 'Athary',
                    username: 'farid', 
                    password: '123456', 
                    password2: '1234567', 
                    sex: 1, 
                    mobile: 9123456789
                }
                server
                .post("/signup")
                .send(userInfo)
                .expect(802)
                .end(done);
            })
    
            it("password is not long enough", function(done){
                let userInfo = {
                    firstName: 'Farid',
                    lastName: 'Athary',
                    username: 'farid', 
                    password: '1234', 
                    password2: '1234', 
                    sex: 1, 
                    mobile: 9123456789
                }
                server
                .post("/signup")
                .send(userInfo)
                .expect(803)
                .end(done);
            })
    
            it("the chosen username is not available", function(done){
                let userInfo = {
                    firstName: 'qerqwrtqw',
                    lastName: 'asdfsafdsfs',
                    username: 'test', 
                    password: 'xzxzvcscsdcsd', 
                    password2: 'xzxzvcscsdcsd', 
                    sex: 1, 
                    mobile: 1111111111
                }
                server
                .post("/signup")
                .send(userInfo)
                .expect(804)
                .end(done);
            })
        });
        describe("when an acceptable user signs up", function(){
            it("should send 201", function(done){
                let userInfo = {
                    firstName: 'Farid',
                    lastName: 'Athary',
                    username: 'FaridA', 
                    password: '1234567', 
                    password2: '1234567', 
                    sex: 1, 
                    mobile: 09123456789
                }
                server
                .post("/signup")
                .send(userInfo)
                .expect(201)
                .end(done);
            })
    
            it("should save it in database", function(done){
                User.findOne({
                    firstName: 'Farid',
                    lastName: 'Athary',
                    username: 'FaridA', 
                    password: '1234567',
                    sex: 1, 
                    mobile: 09123456789
                }, function(err, user) {
                    user.should.not.equal({});
                    done();
                })
            })
        })
    });
    
    describe('Login', function(){
        describe('should not log in for', function(){
            it('wrong username', function(done){
                let userInfo = {
                    username: 'aaaaaa',
                    password: '1234567'
                }
                server
                .post('/login')
                .send(userInfo)
                .expect(800)
                .end(done);
            })
    
            it('wrong password', function(done){
                let userInfo = {
                    username: 'FaridA',
                    password: '667tgueyfgw497r62'
                }
                server
                .post('/login')
                .send(userInfo)
                .expect(800)
                .end(done);
            })
        })
    
        describe("Should show dashboard when", function(done){
            it('a valid user tries to log in', loginUser());
        })
    })

    describe("Articles", function(){
        before(loginUser())

        describe("Finding older articles", function(){
            it("POST /Articles Should return n articles after article number m", function(done){
                server
                .post('/articles')
                .send({
                    quantity: 3,
                    from: 2
                })
                .expect(200)
                .end(function(err, res){
                    let articles = res.body.articles;
                    articles.should.have.length(3);
                    articles.map(function(item, index){
                        item.should.be.an.Object();
                        ("text" in item).should.be.true();
                        ("image" in item).should.be.true();
                        ("author" in item).should.be.true();
                        ("name" in item).should.be.true();
                    })
                    done();
                })
            })

            it("POST /UserArticles Should return all articles by one single user", function(done){
                server
                .post('/userarticles')
                .send({username: "test"})
                .expect(200)
                .end(function(err, res){
                    let articles = res.body.articles;
                    articles.map(function(item, index){
                        item.should.be.an.Object();
                        ("text" in item).should.be.true();
                        ("image" in item).should.be.true();
                        ("author" in item).should.be.true();
                        ("name" in item).should.be.true();
                        item.author.should.equal("test");
                    })
                    done();
                })
            })
            it("POST /TheArticle Should return one article by id", function(done){
                server
                .post('/theArticle')
                .send({id: "5c5998167309ad1cb059c1a3"})
                .expect(200)
                .end(function(err, res){
                    let article = res.body.article;
                    article.should.be.an.Object();
                    ("text" in article).should.be.true();
                    ("image" in article).should.be.true();
                    ("author" in article).should.be.true();
                    ("name" in article).should.be.true();
                    article.name.should.equal("5");
                    article.text.should.equal("gdgthshnudmhi,j.jh.");
                    done();
                })
            })
        })
        
        describe("Creating a new article", function(){
            describe("POST /NewArticle Should not accept an article when it", function(){
                it("has no name", function(done){
                    server
                    .post("/newArticle")
                    .field("articlename", "")
                    .field("articletext", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.")
                    .attach("articleimage", "C:\\Users\\ASUS\\Documents\\finalmaktabproject\\public\\images\\1549375518064.jpg")
                    .expect(801)
                    .end(done);
                });
                it("is shorter than 280 characters", function(done){
                    server
                    .post("/newArticle")
                    .field("articletext", "hi")
                    .field("articlename", "11")
                    .attach("articleimage", "C:\\Users\\ASUS\\Documents\\finalmaktabproject\\public\\images\\1549375518064.jpg")
                    .expect(805)
                    .end(done);
                })
            })
            xit("Should save an acceptable article to database", function(done){

            })
        })
    })

    xdescribe("Profile", function(){
        it("Should give user's information");
        it("Should edit user's information");
    })

    after(function(done){
        User.deleteOne({username: 'FaridA'}, done);
    })
})

