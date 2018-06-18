// Portfolio Link: https://farha-neu.github.io/Responsive-Portfolio/portfolio.html


var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });

  module.exports = connection;