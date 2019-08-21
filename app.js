const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const passport = require('passport')


const app = express();

//load Routes
const proj = require('./routes/proj')
const users = require('./routes/users')

//Passport config
require('./config/passport')(passport)
//connect to Database
mongoose.connect('mongodb://localhost/projot', {useNewUrlParser: true})
.then(() => console.log('MongoDb connected...'))
.catch(err => console.log(err));



//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//method override middleware
app.use(methodOverride('_method'))

//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
//Passport middleware

app.use(passport.initialize());

app.use(passport.session());

//connect flash middleware
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//index Route
app.get('/', (req, res) => res.render('index'));
//about Route
app.get('/about', (req, res) => res.render('about'))


//use Routes
app.use('/proj', proj)
app.use('/users', users)


const port = 5000;
app.listen(port, ()=> console.log(`Server started on ${port}`));