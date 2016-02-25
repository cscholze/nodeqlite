'use strict';

const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const db = new sqlite3.Database('./db/Chinook_Sqlite.sqlite');

const PORT = process.env.PORT || 3000;
let QUERY = '';

// ROUTE MIDDLEWARE
app.get('/', (req, res) => {
  res.send('Welcome to a chinook API');
});

app.get('/invoices-by-country', (req, res) => {
  QUERY = `
    SELECT
      Invoice.BillingCountry AS Country,
      SUM(Invoice.Total) AS "Invoice Totals"
    FROM Invoice
    GROUP BY Invoice.BillingCountry
    ORDER BY "Total Spent" DESC`;

  db.all(QUERY,  (err, rows) => {
    res.send({
      database: "Chinook Sqlite",
      query: "number of invoices per country",
      rows: rows
    });
  });
});


app.get('/sales-per-year', (req, res) => {
  // How many Invoices were there in 2009 and 2011? What are the respective total sales for each of those years?
  //req.query = { filter: { year: '2009,2011' } }

  let having = ``;

  if (req.query.filter) {
    having = 'HAVING';

    req.query.filter.year
      .split(',')
      .map( y => +y )
      .forEach( y => {
        having += ` year= "${y}" OR`;
      });

    having = having.substring(0, having.length - 3);

  }


  QUERY = `
    SELECT
      COUNT(*) AS invoices,
      SUM(Total) AS total,
      strftime('%Y', InvoiceDate) AS year
  FROM Invoice
  GROUP BY Year
  ${having}
  `;


  db.all(QUERY,  (err, rows) => {
    console.log(rows);
    const roundedRows = rows.map( (row) => {
      return {
        invoices: row.invoices,
        year: +row.year,
        total: +row.total.toFixed(2)
      };
    });

    res.send({
      database: "Chinook Sqlite",
      query: "Total Invoices and Sales Per Year",
      rows: roundedRows
    });
  });
});

// START SERVER LISTENING
app.listen(PORT, () => {
  console.log(`Express server listening on ${PORT}`);
});
