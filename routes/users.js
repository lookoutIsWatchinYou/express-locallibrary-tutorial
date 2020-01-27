var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a big resource');
});
router.get('/cool', function(req, res, next) {//path
  res.send("You're so cool");
});

module.exports = router;
