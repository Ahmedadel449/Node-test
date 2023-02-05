var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({/* 200 means success- 202 means update- 304 means warning- 404 means error */
    massage : "its work "
  })
});

module.exports = router;
