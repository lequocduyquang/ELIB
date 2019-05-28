const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 3000

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(PORT, () => console.log('App running on port 3000'))