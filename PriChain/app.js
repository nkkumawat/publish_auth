
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];
const indexRoutes = require('./routes/index');
const dashboardRoutes = require('./routes/dashboard'); 
const publishRoutes = require('./routes/publish'); 
const uploadRoutes = require('./routes/uploader'); 
const bookAuthor = require("./middlewares/bookAuthorContract");
const bookAuthorService = require("./services/bookAuthorService");
const app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json({
    limit: '8mb'
}));

app.use(bodyParser.urlencoded({
    limit: '8mb',
    extended: true
})); 

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    if (req.method == 'POST') {
        console.log('\x1b[36m%s\x1b[0m', 'Request URL:', req.originalUrl);
        console.log(req.body);
        console.log('\x1b[33m%s\x1b[0m', '---------------------------------');
    }
    next();
});

bookAuthorService.getCount().then(result => {
    if(result){
        bookAuthor.createContract();
    }
}).catch(err => {
    console.log(err);
});

app.use('/', indexRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/publish', publishRoutes);
app.use('/uploader', uploadRoutes);

app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.error(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
