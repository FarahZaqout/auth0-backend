var express = require('express');
var router = express.Router();
const secured = require('../lib/middleware/secured');

/* GET home page. */
router.get('/', secured(), function (req, res, next) {
  res.json({ title: 'Kurwa' });
});

module.exports = router;