const express = require('express');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config();

const DatabaseOperations = require('./public/databaseFunctions.js');

const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');
const tableRoute = require('./routes/tablesRoute');
const datapickerRoute = require('./routes/datepickerRoute');
const startRoute = require('./routes/startRoute');

const app = express();

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    const userEmail = req.cookies ? req.cookies.email || '' : '';
    res.locals.email = userEmail;
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(multer().none());
app.use(express.json());
app.use(express.static("static"));

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', loginRoute);
app.use('/', signupRoute);
app.use('/tables', tableRoute);
app.use('/', datapickerRoute);
app.use('/', startRoute);

setInterval(() => {
    DatabaseOperations.deleteExpiredKeys()
        .then(successMessage => {
            console.log(successMessage);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}, 1200000);

DatabaseOperations.deleteExpiredKeys();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
