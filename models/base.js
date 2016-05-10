var mysql = require('mysql');
var _ = require('lodash');
var moment = require('moment');
var accounting = require('accounting');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'Lich',
  password : 'QWEqwe123',
  database : 'invoice'
});

var tarifs = [
  {id: 1, name: 'water', type: 'counter' ,units: 'куб.м', printable: 1, system_id: '40946'},
  {id: 2, name: 'gas', type: 'counter', units: 'куб.м', printable: 1, system_id: '56598'},
  {id: 3, name: 'electricity', type: 'counter', units: 'кВт.час', printable: 1, system_id: '232215'},
  {id: 4, name: 'heat', type: 'static', units: 'мес', printable: 1, system_id: '31589'},
  {id: 5, name: 'communal', type: 'static', units: 'мес', printable: 1, system_id: '38149'},
  {id: 6, name: 'internet', type: 'static', units: 'мес', printable: 0, system_id: '5414801'},
  {id: 7, name: 'garage', type: 'static', units: 'мес', printable: 0, system_id: '35'}
];

function convertToNumber (val) {
  return isNaN(parseFloat(val)) ? 0 : parseFloat(val);
}

function objectToQuery(obj) {
  if (!_.isArray(obj)) {
    obj = [obj]
  }
  var valArray = [];
  var keyArray = _.keys(obj[0]);
  _.each(obj, function(item) {
    valArray.push(_.values(item));
  });
  return {keys: keyArray, vals: valArray}
}

connection.query('CREATE TABLE IF NOT EXISTS tariff_types (id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(50), type VARCHAR(50), units VARCHAR(50), system_id VARCHAR(50), printable BOOL DEFAULT 0, PRIMARY KEY(id))', function(err, rows, fields) {
  if (err) throw err;
  //console.log('The solution is111: ', rows , fields);
  fillTariffTypes();
});

function fillTariffTypes() {
  connection.query('SELECT COUNT(*) AS solution FROM tariff_types', function(err, rows, fields) {
    if (err) throw err;
    //console.log (err, rows, fields)
    if (rows[0].solution === 0) {
      var obj = objectToQuery(tarifs);
      var query = connection.query('INSERT INTO tariff_types (??) VALUES ?', [obj.keys, obj.vals], function(err, rows, fields) {
        if (err) throw err;
        //console.log('The solution is: ', rows ,rows[0], fields);
      });
      //console.log('query.sql', query.sql)
    }
    //connection.end();
  });

}

var query = connection.query('CREATE TABLE IF NOT EXISTS bills (id INT(11) NOT NULL AUTO_INCREMENT, tariff_id INT(11), ' +
    'invoice_id INT(11), counter_prev FLOAT, counter_next FLOAT, tariff_rate FLOAT, tariff_value FLOAT, tariff2_rate FLOAT, tariff2_value FLOAT, cost FLOAT, PRIMARY KEY(id))', function(err, rows, fields) {
  //console.log('query.sql', query.sql)
  if (err) throw err;

  //console.log('The solution is: ', rows ,rows[0]);
});

var query = connection.query('CREATE TABLE IF NOT EXISTS invoices (id INT(11) NOT NULL AUTO_INCREMENT, ' +
    'created_at TIMESTAMP, counted_at TIMESTAMP, title VARCHAR(100), total FLOAT, PRIMARY KEY(id))', function(err, rows, fields) {
  //console.log('query.sql', query.sql)
  if (err) throw err;
  fillFirstInvoice()
  //console.log('The solution is: ', rows ,rows[0]);
});

function fillFirstInvoice() {
  var invoice = {
    total: 0,
    title: "2016.01.01",
    counted_at: moment('2015-12-01').format("YYYY-MM-DD HH:mm:ss")
  };
  var bills = [
    {
      tariff_id: 1,
      invoice_id: 1,
      counter_prev: 64,
      counter_next: 81,
      tariff_rate: 9.684,
      cost: 164.63
    },{
      tariff_id: 2,
      invoice_id: 1,
      counter_prev: 1310,
      counter_next: 1383,
      tariff_rate: 7.188,
      cost: 524.72
    },{
      tariff_id: 3,
      invoice_id: 1,
      counter_prev: 6786,
      counter_next: 7209,
      tariff_rate: 0.456,
      tariff_value: 100,
      tariff2_rate: 0.789,
      cost: 300.45
    },{
      tariff_id: 4,
      invoice_id: 1,
      tariff_rate: 477.6,
      cost: 477.6
    },{
      tariff_id: 5,
      invoice_id: 1,
      tariff_rate: 50,
      cost: 50
    },{
      tariff_id: 6,
      invoice_id: 1,
      tariff_rate: 55,
      cost: 55
    },{
      tariff_id: 7,
      invoice_id: 1,
      tariff_rate: 0,
      cost: 400
    }
  ]
  connection.query('SELECT COUNT(*) AS solution FROM invoices', function(err, rows, fields) {
    if (err) throw err;
    if (rows[0].solution === 0) {
      var obj = objectToQuery(invoice);
      var query = connection.query('INSERT INTO invoices (??) VALUES ?', [obj.keys, obj.vals], function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows ,rows[0], fields);
        _.each(bills, function(bill) {
          var obj_bill = objectToQuery(bill);
          var query = connection.query('INSERT INTO bills (??) VALUES ?', [obj_bill.keys, obj_bill.vals], function(err, rows, fields) {
            if (err) throw err;
            console.log('The solution is: ', rows ,rows[0], fields);
            console.log('query.sql', query.sql)
          });
        });
      });
    }
    //connection.end();
  });

}

function addTariff(req, res, next) {
  var invoiceRequiredFields = {

  }
  var billRequiredFields = {
    'invoice.title': true,
    'invoice.counted_at': true,
    'bill.gas.counter_prev': true,
    'bill.gas.counter_next': true,
    'bill.gas.tariff_rate': true,
    'bill.water.counter_prev': true,
    'bill.water.counter_next': true,
    'bill.water.tariff_rate': true,
    'bill.electricity.counter_prev': true,
    'bill.electricity.counter_next': true,
    'bill.electricity.tariff_rate': true,
    'bill.electricity.tariff_value': true,
    'bill.electricity.tariff2_rate': true,
    'bill.communal.tariff_rate': true,
    'bill.heat.tariff_rate': true
  }

  if (req.body && _.size(req.body) > 0) {
    var form = req.body
    var form_parts = {}
    var state = {};
    _.each(form, function(val, key){
      if (billRequiredFields[key] && (val === '' || val === 'null')) {
        if (val === '') {
          state[key] = 'empty'
        }
        if (val === 'null') {
          state[key] = 'null'
        }
        //throw new Error('oh no!');
      } else {
        var k = key.match(/^(\w+)\.(.+)/);
        if (_.isUndefined(form_parts[k[1]])) form_parts[k[1]] = {}
        form_parts[k[1]][k[2]] = val
      }
    });
    var form_invoice = form_parts.invoice;

    var form_bills = {};
    _.each(form_parts.bill, function(val, key){
      var k = key.match(/^(\w+)\.(\w+)/);
      if (_.isUndefined(form_bills[k[1]])) form_bills[k[1]] = {}
      form_bills[k[1]][k[2]] = val
    })

    var total = 0;
    _.each(form_bills, function(val,key){
      var cost = 0;
      var counter_diff = 1;
      if (!_.isEmpty(val.counter_prev) && !_.isEmpty(val.counter_next)) {
        counter_diff = convertToNumber(val.counter_next) - convertToNumber(val.counter_prev);
      }
      if (!_.isEmpty(val.tariff_value) && !_.isEmpty(val.tariff2_rate)) {
        var tarif2_value = counter_diff - convertToNumber(val.tariff_value);
        if (tarif2_value > 0) {
          counter_diff -= tarif2_value;
          cost += tarif2_cost * convertToNumber(val.tariff2_rate);
        }
      }
      if (!_.isEmpty(val.tariff_rate)) {
        cost += convertToNumber(val.tariff_rate) * counter_diff
      }
      val.cost = accounting.toFixed(cost, 2);
      total += convertToNumber(val.cost);
    });
    form_invoice.total = accounting.toFixed(total, 2);
    if (_.isEmpty(state)) {
      var obj = objectToQuery(form_invoice);
      var query = connection.query('INSERT INTO invoices (??) VALUES ?', [obj.keys, obj.vals], function (err, rows, fields) {
        if (err) throw err;
        var invoice_id = rows.insertId;
        _.each(form_bills, function (bill, key) {
          var tariff = _.find(tarifs, {name: key});
          if (_.isUndefined(bill.tariff_id)) bill.tariff_id = tariff.id;
          if (_.isUndefined(bill.invoice_id)) bill.invoice_id = invoice_id;
        });
        var new_bills = _.values(form_bills)
        _.each(new_bills, function (bill) {
          var obj_bill = objectToQuery(bill);
          var query = connection.query('INSERT INTO bills (??) VALUES ?', [obj_bill.keys, obj_bill.vals], function (err, rows, fields) {
            if (err) throw err;
            console.log('The solution is: ', rows, rows[0], fields);
            console.log('query.sql', query.sql)
          });
        });
        next();
      })
    } else {
      console.log('error', state);
      res.locals.errors = state;
      next()
    }
  }
}

function getLastTariff(req, res, next) {
  connection.query('SELECT id FROM invoices ORDER BY id DESC LIMIT 1', function(err, rows, fields) {
    if (err) throw err;
    connection.query('SELECT * FROM bills LEFT JOIN tariff_types ON bills.tariff_id = tariff_types.id WHERE bills.invoice_id = ' + rows[0].id, function (err, rows, fields) {
      if (err) throw err;
      if (rows.length > 0) {
        var lastBills = {};
        _.each(rows, function (row) {
          lastBills[row.name] = row
        });
        res.locals.lastBills = lastBills
      }
      next();
    });
    console.log('connected as id ' + connection.threadId);
  });
}

function getAllInvoices(req, res, next) {
  var id = parseInt(req.params.invoice_id);
  connection.query('SELECT * FROM invoices ORDER BY id DESC', function(err, rows, fields) {
    res.locals.allInvoices = rows;
    if (id) {
      res.locals.curr_invoice = _.find(rows, {id: id})
    }
    next();
  })
}

function getInvoice(req, res, next) {
  var id = req.params.invoice_id
  connection.query('SELECT * FROM bills LEFT JOIN tariff_types ON bills.tariff_id = tariff_types.id WHERE bills.invoice_id = ' + id, function(err, rows, fields) {
    res.locals.invoiceInfo = rows;
    next();
  })
}

module.exports = connection;
module.exports.addTariff = addTariff;
module.exports.getLastTariff = getLastTariff;
module.exports.getAllInvoices = getAllInvoices;
module.exports.getInvoice = getInvoice;