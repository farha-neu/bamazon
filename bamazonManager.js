var inquirer = require("inquirer");
var connection = require("./connection.js");
const {table} = require('table');
var chalk = require("chalk");

var data = [];
var idArray = [];
var output;
var headerText = chalk.cyanBright;
var welcome = chalk.magentaBright;
var warning = chalk.bgRed;
var subheader = chalk.yellow;
var error = chalk.redBright;
var success = chalk.greenBright;
var addInventory = false;
var lowInventoryCount = 5;
var departments = [];

  connection.connect(function(err) {
    if (err) throw err;
    displayWelcomeMessage();
    showMenu();
  });

  function displayWelcomeMessage(){
    console.log(welcome("\n~+~+~+ Logged in as Manager: Bamazon +~+~+~\n"));
  }

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
              connection.end();
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
        console.log(subheader("\nBamazon Inventory List"));
        var header = [headerText('Item ID'),headerText('NAME'),headerText('DEPARTMENT'),headerText('UNIT PRICE'), headerText('QUANTITY')];
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
          var department = res[i].department_name;
          var item = [item_id, product_name,department,"$"+price,quantity];
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
        console.log(subheader("\nList of Low Inventories"));
        if(res.length > 0){
            var header = [headerText('Item ID'),headerText('NAME'),headerText('DEPARTMENT'),headerText('PRICE'), headerText('QUANTITY')];
            data.push(header);
            for (var i = 0; i < res.length; i++) {
                var item_id = res[i].item_id;
                var product_name = res[i].product_name;
                var price = res[i].price;
                var quantity = res[i].stock_quantity;
                var department = res[i].department_name;
                var item = [item_id,product_name,department,"$"+price,quantity];
                data.push(item);
            }       
            output = table(data);
            console.log(output);
        }
        else{
            console.log(success("Low inventory not found. All items have quantity greater than 5!\n"));
        }
        showMenu();
    });
  }

  function addToInventory(){
     addInventory = true;
     displayItems();
  }


  function selectItem(){
    console.log(subheader("Add to above inventory\n"));
    inquirer
    .prompt({
          type: 'input',
          name: 'itemId',
          message: "Please enter item ID of the product you want to restock:",
          validate: function(input){
            if(!input.trim()){
              return error("Please enter an item ID:");
            }
            else if(idArray.indexOf(input.trim().toUpperCase()) > -1){
                return true;
            }
            else{
              return error("Item ID doesn't match with any of our available products.\nPlease enter a valid item ID:");
            }
          }
        })
       .then(answers => {
           var itemId = answers["itemId"].trim().toUpperCase();
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
            var num = parseInt(input.trim());
            if(typeof num ==="number"){
              if(parseInt(input.trim())<=0){
                return error("Quantity cannot be zero or less. Please enter a valid quantity:");
              }
              else if(!num){
                return error("Please enter a quantity:");
              }
              return true;
            }
            return error("Please enter a number:");
          }
        })    
       .then(answers => {
           var quantity = answers["quantity"].trim();
           addItem(itemId, quantity);
      });
  }


  function addItem(itemId, quantity){
        inquirer.prompt([
            {
              type: "confirm",
              name: "restock",
              message: "Are you sure you want to add "+quantity+" items with ID "+itemId+" to inventory?"
            }, 
          ]).then(function(user){
              addInventory = false;
              if(user.restock){
                var query = connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
                [quantity,itemId],function(err, res){
                   if(err){
                    console.log(error("\nSorry item couldn't be updated.\n"));
                   }
                   else{
                    console.log(success("\n"+quantity+" items with item ID "+itemId+" added to inventory!\n"));
                   }
                   showMenu();
                });
              }
              else{
                  console.log(success("\nItem is not updated.\n"));
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
                    return error("Please enter product's name:");
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
            message: "Enter price (in US dollar) of the item:",
            validate: function(input){
              if(input.trim()){
                var num = parseInt(input.trim());
                if(isNaN(num)){
                  return error("Please enter price (in US dollar) in number:");
                }
                //NaN is also a number
                else if(typeof num ==="number"){
                  return true;
                }
              }       
              //if blank
              return error("Please enter price (in US dollar):");
            }
        },
        {
            type: "input",
            name:"stockQuantity",
            message: "Enter stock quantity:",
            validate: function(input){
              if(input.trim()){
                var num = parseInt(input.trim());
                if(isNaN(num)){
                  return error("Please enter quantity in number:");
                }
                //NaN is also a number
                else if(typeof num ==="number"){
                  return true;
                }
              }       
              //if blank
              return error("Please enter quantity:");
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
         console.log(success("\nAddition canceled.\n"));
         showMenu();
      }
    });
  }


  function proceedAddition(inputs){
    var itemId = inputs.itemId.trim().toUpperCase();
    var productName = inputs.productName.trim();
    var departmentName = inputs.departmentName;
    var priceItem = inputs.price.trim();
    var stockQuantity = inputs.stockQuantity.trim();
    var query = connection.query("INSERT INTO products SET ?",
    {item_id: itemId,
    product_name: productName,
    department_name: departmentName,
    price: priceItem,
    stock_quantity: stockQuantity},
    function(err, res){
      if(err){
            if(err.code === "ER_DUP_ENTRY"){
              console.log(error("\nSorry. Product could not be added.\nItem ID already exists. Try adding to inventory instead.\n"));
            }
            else if(err.code === "ER_DATA_TOO_LONG"){
               console.log(error("\nSorry. Product could not be added.\nItem ID should be less than 8 characters long.\n"));
            }
            else{
              console.log(error("\nSorry. Product could not be added.\n"));
            }
      }
      else{
        var dataItem = [];
        console.log("\nFollowing new product is added:");
        var header = [headerText('Item ID'),headerText('NAME'),headerText('DEPARTMENT'),headerText('PRICE'), headerText('QUANTITY')];
        dataItem.push(header);
        dataItem.push([itemId, productName, departmentName, "$"+priceItem, stockQuantity]);
        var outputTable = table(dataItem);
        console.log(outputTable);
      }
      showMenu();
    });  
  } 
  

 