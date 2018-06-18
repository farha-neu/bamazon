var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');
var chalk = require("chalk");

var data = [];
var output;
var headerText = chalk.cyanBright;
var welcome = chalk.magentaBright;
var subheader = chalk.yellow;
var error = chalk.redBright;
var success = chalk.greenBright;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    displayWelcomeMessage();
    showMenu();
  });
  
  function displayWelcomeMessage(){
    console.log(welcome("\n~+~+~+ Logged in as Supervisor: Bamazon +~+~+~\n"));
  }

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
    var query = connection.query("SELECT department_id, departments.department_name, over_head_costs, IFNULL(SUM(product_sales),0) AS product_sales,"+
    "(IFNULL(SUM(product_sales), 0) - over_head_costs) AS total_profit FROM products RIGHT JOIN departments ON "+
    "products.department_name = departments.department_name "+
    "group by departments.department_name "+
    "order by department_id;", 
    function(err, res){
        if(err){
             console.log("Sorry, your request couldn't be processed");
        }
        else{
            console.log(subheader("\nProduct Sales By Department"));
            var header = [headerText('DEPARTMENT ID'),headerText('DEPARTMENT NAME'),headerText('OVERHEAD COSTS'), headerText('PRODUCT SALES'),
            headerText('TOTAL PROFIT')];
            data.push(header);
            for (var i = 0; i < res.length; i++) {
                var departmentId = res[i].department_id;
                var departmentName = res[i].department_name;
                var overheadCost= res[i].over_head_costs;
                var productSales= res[i].product_sales;
                var profit = res[i].total_profit;
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
    console.log(subheader("\nCreate new department\n"));
    inquirer.prompt([
    {
        type: "input",
        name: "departmentName",
        message: "Enter department's name:",
        validate: function(input){
            if(input)
              return true;
            else
              return error("Please enter a department's name:");
        }
    },
    {
        type: "input",
        name:"overheadCost",
        message: "Enter overhead cost of the department:",
        validate: function(input){
            var num = parseFloat(input.trim());
            if(typeof num==="number" && num){
                return true;
            }
            return error("Please enter the overhead cost in number:");
          }   
    } 
   ]).then(function(inputs){
        promptAddition(inputs);
    });  
  }

  function promptAddition(inputs){
    inquirer.prompt([
      {
        type: "confirm",
        name: "continue",
        message: "Are you sure you want to create the department?"
      }, 
    ]).then(function(user){
      if(user.continue){
         proceedAddition(inputs);
      }
      else{
         console.log(success("\nDepartment creation canceled.\n"));
         showMenu();
      }
    });
  }

  function proceedAddition(inputs){
      var departmentName = inputs.departmentName.trim();
      var overheadCost = inputs.overheadCost.trim();

      var query = connection.query("INSERT INTO departments SET ?",
      {department_name : departmentName, over_head_costs : overheadCost}, function(err, res){
        if(err){
            if(err.code === "ER_DUP_ENTRY"){
              console.log(error("\nDepartment already exists. Try creating a new one.\n"));
            }
            else{
              console.log(error("\nSorry. Department could not be created.\n"));
            }
       }
       else{
        console.log(success("\n"+departmentName+" department with overheadcost of $"+overheadCost+" is added!\n"));
      }
      showMenu();

      });
  }

  