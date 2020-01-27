// wiki.js - Wiki route module.

var express = require('express');//importing express object
var router = express.Router(); //assigning a router object from express

// Home page route.
router.get('/', function (req, res) {//adding routes with .get()
  res.send('Wiki home page');
})

// About page route.
router.get('/about', function (req, res) {
  res.send('About this wiki');
})

module.exports = router;//exporting so its available in main?