const express = require('express')
const cors = require('cors')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const errorHandler = require('./middleware/errorHandler')
const bookRoutes = require('./routes/book')
const adminRoutes=require('./routes/admin');
const app = express()

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

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/terms', (req, res) => {
    res.render('terms')
})

app.use('/book', bookRoutes)

app.use('/admin', adminRoutes);

app.use(errorHandler)

app.listen(PORT, () => console.log('App running on port 3000'))