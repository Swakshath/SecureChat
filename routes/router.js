const express = require('express');
const router = express.Router();

router.get('/', function(req,res){
    console.log('in');
    res.render('homepage')
})

module.exports = router;