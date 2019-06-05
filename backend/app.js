const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user')
const adminRoutes=require('./routes/admin');
const app = express()

app.use(cors())
app.use(morgan('dev'))
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


app.use('/', userRoutes)

app.use('/admin', adminRoutes);



app.listen(PORT, () => console.log('App running on port 3000'))