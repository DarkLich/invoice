var express = require('express');
var router = express.Router();
var base = require('../models/base');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('invoice_form', { title: 'Express' });
});

router.get('/create', base.getLastTariff, function(req, res, next) {
  //console.log (req, res, next)
  console.log ('90909090', res.locals.lastBills)
  res.render('invoice_form');
});

router.get('/all', base.getAllInvoices, function(req, res, next) {
  //console.log (req, res, next)
  //console.log ('90909090', res.locals.lastBills)
  res.render('invoices');
});

router.post('/create', base.addTariff, function (req, res, next) {
  res.send(res.body)
});

module.exports = router;
