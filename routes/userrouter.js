const express = require('express');
const mysql = require('mysql')
const unirest = require('unirest');
const userrouter = express.Router();
const connection = require('../connection.js');
var multer = require("multer");
var formidable = require('formidable');
var fs = require('fs')
/*var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './styles/propics'); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, req.session.id1 + '.jpg'); // set the file name and extension
    }
});
var upload = multer({storage: storage});*/


userrouter.get('/',function(req,res){
        var query2 = 'SELECT username, phone, propic from users where userid in (SELECT id1 from conv where id2 = "'+req.session.id1+'")';
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
        res.write('File uploaded and moved!');
        res.end();
      })

}) })

userrouter.post('/searchnum', function(req,res){
    console.log(req.body.numtofind);
    var query2 = 'SELECT Username, userid from users where phone="'+req.body.numtofind+'"';
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

userrouter.get('/chatpage', function(req, res){
    res.render('chatpage');
})

module.exports = userrouter;