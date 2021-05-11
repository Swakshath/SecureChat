const express = require('express');
const mysql = require('mysql')
const unirest = require('unirest');
const userrouter = express.Router();
const connection = require('../connection.js');
var multer = require("multer");
var formidable = require('formidable');
var fs = require('fs');
const { connect } = require('../connection.js');
const Blowfish = require('egoroof-blowfish')
const randomstring = require('randomstring')
/*var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './styles/propics'); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, req.session.id1 + '.jpg'); // set the file name and extension
    }
});
var upload = multer({storage: storage});*/

var otp;

userrouter.get('/',function(req,res){
        var query2 = 'SELECT username, phone, propic, userid from users where userid in (SELECT id1 from conv where id2 = "'+req.session.id1+'")';
        connection.query(query2, function(err, result1){
            console.log('res1'+JSON.stringify(result1))
            res.render('userhome',{result: result1})
        })

  })
  
  userrouter.get('/viewprofile',function(req,res){
    var query1 = "SELECT username, email, phone, bio, propic from users where userid =" + req.session.id1;
    var row = connection.query(query1, function(err,result){
    console.log(result[0]+req.session.id1);

    res.render('viewprofile',{data: result});
    })

  })
  

userrouter.post('/updatepro',async function(req,res){
    /*upload(req,res,function(err) {
        if(err) {
            return res.end(err.toString());
        }
        res.end("File is uploaded");
    });*/

    /*console.log('bhbhb'+JSON.stringify(req.body));
    var query2 = 'INSERT into users(Username,gender,propic) values("'+req.body.uname+'","M","default.png")';
    connection.query(query2);
    res.send("done111");*/
    console.log("inserv")
    console.log('fifijf'+JSON.stringify(req.body));
    res.send("done");
    var query2 = 'UPDATE users set username="'+req.body.uname+'", bio = "'+req.body.bio+'" where userid = "'+req.session.id1+'"'
    var resu = connection.query(query2);
        
})

userrouter.post('/updatepropic',function(req, res){
    console.log('injeree'+JSON.stringify(req.body));
    var form = new formidable.IncomingForm();
    console.log('opbol')
    form.parse(req, function (err, fields, files) {
      var oldpath = files.picc.path;
      var newpath = 'C:/Users/Raj/Documents/SecureChat/styles/propics/' + req.session.id1 + '.jpg';
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        else 
        {
            var query2 = "UPDATE users set propic = '"+req.session.id1+".jpg' where userid = '"+req.session.id1+"'";
            connection.query(query2);
            var sess = req.session;
            sess.pic=(req.session.id1+".jpg").toString();
        }
        res.write('File uploaded and moved!');
        res.end();
      })

}) })

userrouter.post('/searchnum', function(req,res){
    console.log(req.body.numtofind);
    var query2 = 'SELECT Username, userid, propic from users where phone="'+req.body.numtofind+'"';
    var row = connection.query(query2, function(err,result){
        if(result.length>0)
        {
            res.json({succ:"1", searchedfor:result[0]});    
        }
        else
        {
            res.json({succ:"0"});
        }
    })
})

userrouter.get('/chatpage/:receiver', function(req, res){
    console.log(req.params.receiver);
    var recc = {rece: req.params.receiver}
    console.log(recc)
    var query2 = 'SELECT*from authen where id2 = "'+req.session.id1+'" and id1 = "'+req.params.receiver+'"';
    connection.query(query2,function(err, result){
        console.log('reslength'+result.length)
        if(result.length==0)
        {
            var query1 = 'SELECT content, sender, created_at from conv_reply where conv_id in (select convid from conv where (id1="'+req.session.id1+'" and id2= "'+req.params.receiver+'") or (id2="'+req.session.id1+'" and id1= "'+req.params.receiver+'")) order by created_at desc' ;
            console.log(query1)
            const bf = new Blowfish('123', Blowfish.MODE.CBC, Blowfish.PADDING.NULL); // only key isn't optional  
            bf.setIv('abcdefgh');
            connection.query(query1, function(err, result){
                for( i in result)
                {
                    var mess = result[i].content.split(',')
                    console.log(mess)
                    result[i].content = bf.decode(Uint8Array.from(mess), Blowfish.TYPE.STRING)
                    console.log(result[i].created_at)
                    result[i].created_at = result[i].created_at.toISOString().slice(0, 19).replace('T', ' ');
                }
                res.render('chatpage', {data:recc, res1:result});
                //res.send("done")
            })
        }
        else
        {
            otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
              });
                  console.log(otp);
                     /*var fastmsg = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
                      
                      fastmsg.headers({
                        "authorization": "Ewvy45UlsmRr9nihA387YteCPMKLq2OSIXQ1oFaJfjuBVN0dWHx9E5gykXIUDNl2zKQMFLj08fba1YCq"
                      });
                  
                      //var num=(Req.body.phone).toString()
                      console.log('jk'+req.session.phonenum)
                      /*fastmsg.form({
                        "message": "Your otp for SecureChat login is "+otp,
                        "language": "english",
                        "route": "q",
                        "numbers": (req.sess.phonenum).toString()
                      });
                      
                      fastmsg.end(function (res) {
                        if (res.error) throw new Error(res.error);
                      
                        console.log(res.body);
                      });*/
                      
                     //res.send("1")
                      console.log("haere"+req.session.phonenum);
                      console.log(otp);
                        req.session.otpauth = otp;
                      var res1 = {otpenter:otp, rece:req.params.receiver}

                    res.render('authenticate', {res1:res1});

        }

        
    })
   
    
})

userrouter.post('/sendmsg', function(req, res){
    console.log("inn")
    console.log('msg'+req.body.msg)
    const bf = new Blowfish('123', Blowfish.MODE.CBC, Blowfish.PADDING.NULL); // only key isn't optional  
    bf.setIv('abcdefgh'); // optional for ECB mode; bytes length should be equal 8  
    var mess = bf.encode(req.body.msg);
    console.log(mess)
    console.log(bf.decode(mess, Blowfish.TYPE.STRING))
    var query1 = 'SELECT convid from conv where id1 = "'+req.session.id1+'" and id2 = "'+req.body.rec+'"'
    console.log(query1)
    connection.query(query1, function(err, result){
        var d = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var query2 = 'INSERT into conv_reply(conv_id, content, created_at, sender) values ("'+result[0].convid+'", "'+mess+'", "'+d+'", "'+req.session.id1+'")';
        console.log(query2)
        connection.query(query2, function(err, result){
            res.send("done")
        })
    })
    //res.send("fone")
})

userrouter.post('/authenticate', function(req, res){
    console.log("onn")
    var query1 = 'INSERT into authen values ("'+req.session.id1+'", "'+req.body.rec+'")';
    console.log(query1);
    connection.query(query1, function(err, result){
        res.send("done")
    }) 
})

userrouter.post('/sendauthen', function(req, res){
    console.log("came here")
    if(req.body.otpentered==req.session.otpauth)
    {
        var query1 = 'DELETE from authen where id2 = "'+req.session.id1+'" and id1="'+req.body.rec+'"';
        connection.query(query1, function(err, result){
            res.send('1')
        })
 
    }
    else
    {
        res.send('0')
    }
     
})

module.exports = userrouter;