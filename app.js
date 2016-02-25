'use strict';

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./db/Chinook_Sqlite.sqlite');

const QUERY = `SELECT   Invoice.BillingCountry AS Country,
                        SUM(Invoice.Total) AS "Invoice Totals"
               FROM Invoice
               GROUP BY Invoice.BillingCountry
               ORDER BY "Total Spent" DESC`;

db.all(QUERY,  (err, rows) => {

  console.log('LOG>>>>>\n',rows);
});
