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
const MongoStore = require('connect-mongo')(session)
const {
    generateTime
} = require('./helpers/handlebars-helpers')

const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin');
const app = express()
var auth = require('./middleware/auth');


// Passport Config
require('./middleware/userPassport')(passport);


app.use(cors())
app.use(morgan('dev'))
mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://admin:admin123@elib-jpw9y.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true
}).then(() => console.log('Connected MongoDB'))
    .catch(err => console.log(err))


app.engine('handlebars', exphbs({
    helpers: {
        section: hbs_sections(),
        format: name => {
            return name.split(' ').slice(-1).join(' ');
        },
        generateTime: generateTime
    }
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

const PORT = 5000

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        cookie: { maxAge: 180 * 60 * 1000 }
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

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use(require('./middleware/auth-locals.mdw'))

app.use('/', userRoutes)

app.use('/admin', auth, adminRoutes);



app.listen(PORT, () => console.log('App running on port 5000'))