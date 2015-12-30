var mysql = require('mysql');
var _ = require('lodash');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'Lich',
  password : 'QWEqwe123',
  database : 'invoice'
});

var tarifs = [
  {type: 'water', units: 'куб.м', printable: 1, system_id: '40946'},
  {type: 'gas', units: 'куб.м', printable: 1, system_id: '56598'},
  {type: 'electricity', units: 'кВт.час', printable: 1, system_id: '232215'},
  {type: 'heat', units: 'мес', printable: 1, system_id: '31589'},
  {type: 'communal', units: 'мес', printable: 1, system_id: '38149'},
  {type: 'internet', units: 'мес', printable: 0, system_id: '5414801'}
];

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

connection.query('CREATE TABLE IF NOT EXISTS tariff_types (id INT(11) NOT NULL AUTO_INCREMENT, type VARCHAR(100), units VARCHAR(100), system_id VARCHAR(50), printable BOOL DEFAULT 0, PRIMARY KEY(id))', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is111: ', rows , fields);
  fillTariffTypes();
});

function fillTariffTypes() {
  connection.query('SELECT COUNT(*) AS solution FROM tariff_types', function(err, rows, fields) {
    if (err) throw err;
    console.log (err, rows, fields)
    if (rows[0].solution === 0) {
      var obj = objectToQuery(tarifs);
      var query = connection.query('INSERT INTO tariff_types (??) VALUES ?', [obj.keys, obj.vals], function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows ,rows[0], fields);
      });
      console.log('query.sql', query.sql)
    }
    connection.end();
  });

}

var query = connection.query('CREATE TABLE IF NOT EXISTS tariffs (id INT(11) NOT NULL AUTO_INCREMENT, type_id INT(11), ' +
    'created_at TIMESTAMP, value FLOAT, PRIMARY KEY(id))', function(err, rows, fields) {
  console.log('query.sql', query.sql)
  if (err) throw err;

  console.log('The solution is: ', rows ,rows[0]);
});

function addTariff(req, res, next) {
  console.log('form', req)
}

module.exports = connection;
module.exports.addTariff = addTariff;