const express = require('express');
const mysql = require('mysql')
const unirest = require('unirest');
const userrouter = express.Router();
const connection = require('../connection.js');
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './styles/propics'); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, req.session.id1 + '.jpg'); // set the file name and extension
    }
});
var upload = multer({storage: storage});

userrouter.get('/',function(req,res){
    res.render('userhome');
  })
  
  userrouter.get('/viewprofile',function(req,res){
    var query1 = "SELECT username, email, phone, bio, propic from users where userid =" + req.session.id1;
    var row = connection.query(query1, function(err,result){
    console.log(result[0]+req.session.id1);

    res.render('viewprofile',{data: result});
    })

  })
  

userrouter.post('/updatepro',upload.single('picc'),async function(req,res){
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
    var query2 = 'UPDATE users set propic = "'+req.session.id1+'.jpg",username="'+req.body.uname+'", bio = "'+req.body.bio+'" where userid = "'+req.session.id1+'"'
    var resu = connection.query(query2);
        
})

module.exports = userrouter;