const express = require('express')
const cors = require('cors')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const flash = require('connect-flash')
const bcrypt = require('bcryptjs')

const errorHandler = require('./middleware/errorHandler')
const bookRoutes = require('./routes/book')
const adminRoutes = require('./routes/admin')
const app = express()

const User = require('./models/User')

app.use(cors())
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/bookstore', {
    useNewUrlParser: true
}).then(() => console.log('Connected MongoDB'))
    .catch(err => console.log(err))

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: 'supersecret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')
    next()
})

const PORT = 3000


app.get('/', (req, res) => {
    res.render('home')
})
app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/faq', (req, res) => {
    res.render('faq')
})
app.get('/privacy', (req, res) => {
    res.render('privacy')
})
app.get('/terms', (req, res) => {
    res.render('terms')
})
app.use('/book', bookRoutes)


/* =========== Authentication =============== */
app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    let errors = []

    if(!req.body.name) {
        errors.push({
            message: 'Please input your name'
        })
    }

    if(!req.body.email) {
        errors.push({
            message: 'Please input your email'
        })
    }

    if(!req.body.password) {
        errors.push({
            message: 'Please input your password'
        })
    }
    console.log(req.body)
    if(errors.length > 0) {
        res.render('register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
        })
    } else {
        User.findOne({email: req.body.email}).then(user => {
            if(!user) {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        newUser.password = hash
        
                        newUser.save().then(savedUser => {
                            req.flash('success_message', 'You are registered successfully. Please Log in')
                            res.redirect('/login')
                        })
                    })
                })
            } else {
                req.flash('error_message', 'Email is already registered')
                res.redirect('/register')
            }
        })
    }
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
    User.findOne({ email: email }).then(user => {
        if(!user) {
            return done(null, false, { message: 'No user found'})
        }
        bcrypt.compare(password, user.password, (err, matched) => {
            if(err) {
                return err
            }

            if(matched) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Incorrect password' })
            }
        })
    }) 
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

app.use('/admin', adminRoutes);

app.use(errorHandler)

app.listen(PORT, () => console.log('App running on port 3000'))