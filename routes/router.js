const express = require('express');
const mysql = require('mysql')
const unirest = require('unirest');
const router = express.Router();

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'securechat'
});

var otp;

// connect to mysql
connection.connect(function(err) {
    // in case of error
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
});

router.get('/', function(req,res){
    /*console.log('in');
    $query = 'SELECT * from users LIMIT 10';

    connection.query($query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
        return;
    }

    console.log("Query succesfully executed: ", rows);
});*/
    res.render('homepage')
})

router.get('/login',function(req,res){
    res.render('login');
})

router.post('/otp',function(Req,res){
    otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    console.log(otp);
    console.log(typeof(Req.body.phone))
       var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
        
        req.headers({
          "authorization": "Ewvy45UlsmRr9nihA387YteCPMKLq2OSIXQ1oFaJfjuBVN0dWHx9E5gykXIUDNl2zKQMFLj08fba1YCq"
        });
    
        var num=(Req.body.mobile).toString()
        console.log('jk'+num)
        /*req.form({
          "message": "Your otp for SecureChat login is "+otp,
          "language": "english",
          "route": "q",
          "numbers": (Req.body.mobile).toString()
        });*/
        
        req.end(function (res) {
          if (res.error) throw new Error(res.error);
        
          console.log(res.body);
        });
        
        res.send("Sent msg")
        //Req=JSON.parse(Req.body)*/
        console.log("haere"+Req.body.mobile);
        console.log(otp);
})

router.post('/regsubmit',function(req,res){

    var query1 = 'INSERT into users values('+req.body.fname+','+req.body.lname+')';
    connection.query(query1);


})

module.exports = router;