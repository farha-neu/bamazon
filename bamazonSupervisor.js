var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');
var chalk = require("chalk");

var data = [];
var output;
var headerText = chalk.cyanBright;
var bold = chalk.bold;
var warning = chalk.bgRed;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log(bold("\nSUPERVISOR'S VIEW\n"));
    showMenu();
  });


  function showMenu(){
    inquirer
    .prompt([
        {
        type: 'list',
        name: 'menuItem',
        message: 'Select your choice:',
        choices: [
            'View Product Sales by Department',
            'Create New Department',
            'Exit'
        ]}
   ])
    .then(answers => {
        switch(answers.menuItem){
            case "View Product Sales by Department":
              displayProductSales();
              break;
            case "Create New Department":
              createNewDepartments();
              break;
            case "Exit":
              connection.end();
              console.log("Logged out.");
              process.exit(0);
              break;
        }
    });
  }

  function displayProductSales(){
    data = [];
    var query = connection.query("SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS product_sales "+
    "FROM products RIGHT JOIN departments ON "+
    "products.department_name = departments.department_name "+
    "group by departments.department_name "+
    "order by department_id;", 
    function(err, res){
        if(err){
             console.log("Sorry, request couldn't be processed");
        }
        else{
            console.log(chalk.yellow("\nProduct Sales By Department"));
            var header = [headerText('DEPARTMENT ID'),headerText('DEPARTMENT NAME'),headerText('OVERHEAD COSTS'), headerText('PRODUCT SALES'),
            headerText('TOTAL PROFIT')];
            data.push(header);
            for (var i = 0; i < res.length; i++) {
                var departmentId = res[i].department_id;
                var departmentName = res[i].department_name;
                var overheadCost= res[i].over_head_costs;
                if(res[i].product_sales===null){
                    var productSales= 0;
                }
                else{
                    var productSales= res[i].product_sales;
                }
                var profit = productSales - overheadCost;
                var item = [departmentId,departmentName,"$"+overheadCost,"$"+productSales,"$"+profit];
                data.push(item);
            }
            output = table(data);
            console.log(output);
        }
        showMenu();
    });

  }

  function createNewDepartments(){
    
  }

  