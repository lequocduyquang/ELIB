const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const flash = require('connect-flash')
var hbs_sections = require('express-handlebars-sections')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')

const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin');
const app = express()

// Passport Config
require('./middleware/userPassport')(passport);

app.use(cors())
app.use(morgan('dev'))
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/bookstore', {
    useNewUrlParser: true
}).then(() => console.log('Connected MongoDB'))
    .catch(err => console.log(err))

app.engine('handlebars', exphbs({
    helpers: {
        section: hbs_sections()
    }
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

const PORT = 3000

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes)

app.use('/admin', adminRoutes);



app.listen(PORT, () => console.log('App running on port 3000'))