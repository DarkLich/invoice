var express = require('express');
var router = express.Router();
var base = require('../models/base');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.redirect('/invoice/create');
});

router.get('/create', base.getLastTariff, function(req, res, next) {
  //console.log (req, res, next)
  console.log ('90909090', res.locals.lastBills)
  res.render('invoice_form');
});

router.get('/all', base.getAllInvoices, function(req, res, next) {
  //console.log (req, res, next)
  console.log ('90909090', res.locals.lastBills)
  res.render('invoices');
});

router.get('/show/:invoice_id', base.getAllInvoices, base.getInvoice, function(req, res, next) {
  console.log('77777777777', req.params.invoice_id)
  //console.log (req, res, next)
  console.log ('90909090', res.locals.lastBills)
  res.render('invoices');
});

router.post('/create', base.addTariff, function (req, res, next) {
  //res.render('invoice_form');
  //res.send({aaaa: res.body})
  console.log ('11111', res)
  if (res.locals.errors) {
    res.json(res.locals.errors);
  } else {
    res.json({state: 'ok'});
  }
  //res.json(res.error);
  //res.end("yes");
});

module.exports = router;
