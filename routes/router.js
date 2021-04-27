const express = require('express');
const mysql = require('mysql')
const unirest = require('unirest');
const router = express.Router();
const crypto = require('crypto');
const randomstring = require('randomstring');
const async = require('async');
const connection = require('../connection.js');

var otp,sess; 

router.get('/', function(req,res){
    res.render('homepage')
})

router.get('/login',function(req,res){
    res.render('login');
})

router.post('/otp',function(Req,res){

  var query2 = 'SELECT*from users where phone="'+Req.body.phone+'"';

 connection.query(query2,function(err,result1){
      if(result1.length>0)
      res.send("0");
      else
      {
        otp = randomstring.generate({
          length: 6,
          charset: 'numeric'
        });
            console.log(otp);
            console.log((Req.body.phone))
               var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
                
                /*req.headers({
                  "authorization": "Ewvy45UlsmRr9nihA387YteCPMKLq2OSIXQ1oFaJfjuBVN0dWHx9E5gykXIUDNl2zKQMFLj08fba1YCq"
                });
            
                var num=(Req.body.phone).toString()
                console.log('jk'+num)
                /*req.form({
                  "message": "Your otp for SecureChat login is "+otp,
                  "language": "english",
                  "route": "q",
                  "numbers": (Req.body.mobile).toString()
                });
                
                req.end(function (res) {
                  if (res.error) throw new Error(res.error);
                
                  console.log(res.body);
                });*/
                
                res.send("1")
                console.log("haere"+Req.body.phone);
                console.log(otp);
        
      }

  })
     
})

router.post('/regsubmit',async function(req,res){

  var salt = randomstring.generate({
    length: 6,
    charset: 'alphanumeric'
  });
    console.log(JSON.stringify(req.body))
    var hashpword = crypto.createHash('sha256').update(req.body.password+salt).digest('hex');
    console.log(hashpword);
    var query1 = 'INSERT into users(Username,dob,gender,phone,pword,bio,salt,email,propic) values("'+req.body.username+'","'+req.body.dob+'","M","'+req.body.phone+'","'+hashpword+'","abc","'+salt+'","'+req.body.email+'","default.png")';
    connection.query(query1);
    res.send("done");
})

router.post('/checkotp',function(req,res){
    console.log('sentotp'+(JSON.stringify(req.body)));
    if(req.body.otpent==otp.toString())
    {
      console.log('op')
      res.json({otp:true})
    }
    else 
    {
      console.log('not')
      res.json({otp:false})
    }
  })

router.post('/loginsubmit',function(req,res){
  console.log('sentlogin'+JSON.stringify(req.body.phone));
  //var query1 = 'SELECT*from users where phone='+req.body.phone+' and pword="'+req.body.pword.toString()+'"';
  var query1= 'SELECT*from users where phone="'+req.body.phone+'"';
  //req.session.namew="op";
  var sess = req.session;
  var row = connection.query(query1,function(err,result){
    console.log(result);
    if(result.length>0)
    {
      var sentpword = crypto.createHash('sha256').update(req.body.pword+result[0].salt).digest('hex');
      if(sentpword==result[0].pword)
      {
      console.log(req.body.phone);
      //req.session.id=5;
      console.log(result[0].userid);
      sess.name=result[0].Username;
      sess.pic=result[0].propic.toString();
        sess.id1=result[0].userid;
        console.log(result[0].userid);
        console.log(sess);
        console.log(sess.id1);
        console.log(sess.name);
        //Object.defineProperty(this,'id',{value:req.sessionID});
        //res.render('userhome');
        res.send("1");
      }
      else
      {
        res.send("0");
      }
    }
    else
    {
    res.send("0");
    }
    //res.send(req.session.name);
  });
  //console.log("herefirst"+row);
  //res.send(row.length);
})


/*router.get('/user/home',function(req,res){
  res.render('userhome');
})*/

router.get('/aboutus',function(req,res){
  res.render('aboutus')
})

module.exports = router;