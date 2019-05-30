const express = require('express')
const cors = require('cors')
const path = require('path')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const errorHandler = require('./middleware/errorHandler')
const bookRoutes = require('./routes/book')
const app = express()

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())
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

app.use(errorHandler)

app.listen(PORT, () => console.log('App running on port 3000'))