var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');
var chalk = require("chalk");

var data = [];
var idArray = [];
var data, output;
var headerText = chalk.cyanBright;
var bold = chalk.bold;
var warning = chalk.bgRed;
var addInventory = false;
var lowInventoryCount = 5;
var departments = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    console.log(bold("\nMANAGER'S VIEW\n"));
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
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add New Product',
            'Exit'
        ]}
   ])
    .then(answers => {
        switch(answers.menuItem){
            case "View Products for Sale":
              displayItems();
              break;
            case "View Low Inventory":
              displayLowInventory();
              break;
            case "Add to Inventory":
              addToInventory();
              break;
            case "Add New Product":
              addNewProduct();
              break;
            case "Exit":
              console.log("Logged out.");
              process.exit(0);
              break;
        }
    });
  }


  function displayItems(){
    data = [];
    idArray = [];
    var query = connection.query("SELECT * FROM products ORDER BY product_name", function(err, res){
        console.log(chalk.yellow("\nBamazon Inventory List"));
        var header = [headerText('Item ID'),headerText('NAME'),headerText('PRICE'), headerText('QUANTITY')];
        data.push(header);
        for (var i = 0; i < res.length; i++) {
          var product_name = res[i].product_name;
          var quantity = res[i].stock_quantity;
          if(quantity < lowInventoryCount){
            var item_id = warning(res[i].item_id);
          }
          else{
            var item_id = res[i].item_id;
          }
          var price = res[i].price;
          var item = [item_id,product_name,"$"+price,quantity];
          data.push(item);
          idArray.push(res[i].item_id);
         }       
         output = table(data);
         console.log(output);
        
         if(!addInventory)
            showMenu();
         else{
            selectItem();
        }
    });
  }

  function displayLowInventory(){
    data = [];
    var query = connection.query("SELECT * FROM products WHERE stock_quantity < ? ORDER BY product_name",[lowInventoryCount],
        function(err, res){
        console.log(chalk.yellow("\nList of Low Inventories"));
        if(res.length>0){
            var header = [headerText('Item ID'),headerText('NAME'),headerText('PRICE'), headerText('QUANTITY')];
            data.push(header);
            for (var i = 0; i < res.length; i++) {
                var item_id = res[i].item_id;
                var product_name = res[i].product_name;
                var price = res[i].price;
                var quantity = res[i].stock_quantity;
                var item = [item_id,product_name,"$"+price,quantity];
                data.push(item);
            }       
            output = table(data);
            console.log(output);
        }
        else{
            console.log("Low inventory not found. All items have quantity greater than 5!\n");
        }
        showMenu();
    });
  }

  function addToInventory(){
     addInventory = true;
     displayItems();
  }


  function selectItem(){
    console.log(chalk.yellow("Add to above inventory\n"));
    inquirer
    .prompt({
          type: 'input',
          name: 'itemId',
          message: "Please enter item ID of the product you want to restock:",
          validate: function(input){
            if(!input.trim()){
              return "Please enter an item ID:";
            }
            else if(idArray.indexOf(input.trim()) > -1){
                return true;
            }
            else{
              return "Please enter a valid item Id:";
            }
          }
        })    
       .then(answers => {
           var itemId = answers["itemId"];
           selectQuantity(itemId);
      });
  }

  
  function selectQuantity(itemId){
    inquirer
    .prompt({
          type: 'input',
          name: 'quantity',
          message: "Enter quantity you want to add:",
          validate: function(input){
            if(Number.isInteger(parseInt(input))){
              if(parseInt(input)<0){
                return "Quantity cannot be zero. Please enter a valid quantity:"
              }
              return true;
            }
            return "Please enter a number:";
          }
        })    
       .then(answers => {
           var quantity = answers["quantity"];
           addItem(itemId, quantity);
      });
  }


  function addItem(itemId, quantity){
        inquirer.prompt([
            {
              type: "confirm",
              name: "restock",
              message: "Do you want to add "+quantity+" items of ID "+itemId+"?"
            }, 
          ]).then(function(user){
              addInventory = false;
              if(user.restock){
                var query = connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
                [quantity,itemId],function(err, res){
                   if(err){
                    console.log("\nSorry item couldn't be updated.\n");
                   }
                   else{
                    console.log("\n"+quantity+" items of item ID "+itemId+" added!\n");
                   }
                   showMenu();
                });
              }
              else{
                  console.log("\nItem is not updated.\n");
                  showMenu();
              }
          });    
  }

  function addNewProduct(){
      console.log(chalk.yellow("\nAdd new product\n"));
      populateDepartments();
      inquirer.prompt([
         {
              type: "input",
              name: "itemId",
              message: "Enter item ID:",
              validate: function(input){
                if(input.trim()){
                    return true;
                }
                else{
                    return "Please enter an item ID:";
                }
              }
         },
         {
            type: "input",
            name: "productName",
            message: "Enter product name:",
            validate:function(input){
                if(input.trim()){
                    return true;
                }
                else{
                    return "Please enter product's name:";
                }
              }
         },
         {
            type: "list",
            name: "departmentName",
            choices: departments,
            message: "Select department:"
        },
        {
            type: "input",
            name:"price",
            message: "Enter price of the item:",
            validate: function(input){
                var num = parseFloat(input.trim());
                if(typeof num==="number" && num){
                    return true;
                }
                return "Please enter the price in number:";
              }   
        },
        {
            type: "input",
            name:"stockQuantity",
            message: "Enter stock quantity:",
            validate: function(input){
              var num = parseInt(input.trim());
              if(typeof num==="number" && num){
                  return true;
              }
              return "Please enter the quantity in number:";
              } 
        }
      ]).then(function(inputs){
         promptAddition(inputs); 
       });        
  }

  function populateDepartments(){
     var query = connection.query("SELECT department_name FROM departments",function(err, res){
         for(var i = 0; i < res.length; i++){
             departments.push(res[i].department_name);
         }
     });
  }

  function promptAddition(inputs){
    inquirer.prompt([
      {
        type: "confirm",
        name: "continue",
        message: "Are you sure you want to add the product?"
      }, 
    ]).then(function(user){
      if(user.continue){
         proceedAddition(inputs);
      }
      else{
         console.log("\nAddition cancelled.\n");
         showMenu();
      }
    });
  }


  function proceedAddition(inputs){
    var query = connection.query("INSERT INTO products SET ?",
    {item_id: inputs.itemId,
    product_name: inputs.productName,
    department_name: inputs.departmentName,
    price: inputs.price,
    stock_quantity: inputs.stockQuantity},
    function(err, res){
      if(err){
            if(err.code === "ER_DUP_ENTRY"){
              console.log("\nSorry. Product could not be added.\nItem id already exists. Try adding to inventory instead.\n");
            }
            else if(err.code === "ER_DATA_TOO_LONG"){
               console.log("\nSorry. Product could not be added.\nItem ID should be less than 8 characters long.\n")
            }
            else{
              console.log("\nSorry. Product could not be added.\n");
            }
      }
      else{
        var dataItem = [];
        console.log("\nFollowing new product is added:");
        var header = [headerText('Item ID'),headerText('NAME'),headerText('DEPARTMENT'),headerText('PRICE'), headerText('QUANTITY')];
        dataItem.push(header);
        dataItem.push([inputs.itemId, inputs.productName, inputs.departmentName, "$"+inputs.price, inputs.stockQuantity]);
        var outputTable = table(dataItem);
        console.log(outputTable);
      }
      showMenu();
    });  
  } 
  

 