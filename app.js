const express = require('express');
const app = express();
const port=8080;
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const cors = require('cors');
const session = require('express-session')
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');


app.use(session({secret: 'anything',saveUninitialized: true,resave: true}));
app.use("/styles",express.static(__dirname + "/styles"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(expressLayout);
app.use(function(req, res, next) {
    res.locals = req.session;
    next();
  })

app.use('/',require('./routes/router.js'));

app.listen(port,function(){
    console.log("Started1 running");
});