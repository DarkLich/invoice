var express = require('express');
var router = express.Router();
var base = require('../models/base');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('invoice_form', { title: 'Express' });
});

router.get('/create', function(req, res, next) {
  console.log (req, res, next)
  res.render('invoice_form', { title: 'Express' });
});

router.post('/create', base.addTariff, function (req, res, next) {
  res.send(res.body)
});

module.exports = router;
