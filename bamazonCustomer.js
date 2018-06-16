var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');
var chalk = require("chalk");

var data = [];
var data, output;
headerText = chalk.cyanBright;

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
    displayItems();
  });

  function displayItems(){
    var query = connection.query("SELECT * FROM products ORDER BY product_name", function(err, res){
        console.log(chalk.yellow("\nList of Bamazon Products for Sale"));
        var header = [headerText('Item ID'),headerText('NAME'),headerText('PRICE')];
        data.push(header);
        for (var i = 0; i < res.length; i++) {
          var item_id = res[i].item_id;
          var product_name = res[i].product_name;
          var price = res[i].price;
          var item = [item_id,product_name,"$"+price];
          data.push(item);
         }       
         output = table(data);
         console.log(output);
         selectItem();
    });
  }

  function selectItem(){
    inquirer
    .prompt({
          type: 'input',
          name: 'itemId',
          message: "Please type the Item ID of the product you want to buy:",
          validate: function(input){
            if(input) {
              return true;
            }
            return "Please enter an Item ID:";
          }
        })    
       .then(answers => {
           console.log(answers["itemId"]);
           var itemId = answers["itemId"];
           selectQuantity(itemId);
      });
  }

  function selectQuantity(itemId){
    inquirer
    .prompt({
          type: 'input',
          name: 'quantity',
          message: "Enter quantity:",
          validate: function(input){
            if(input) {
              return true;
            }
            return "Please enter quantity:";
          }
        })    
       .then(answers => {
           console.log(answers["quantity"]);
           var quantity = answers["quantity"];
           buyItem(itemId, quantity);
      });
  }

  function buyItem(itemId, quantity){
    var query = connection.query("SELECT * FROM products WHERE ?", { item_id: itemId}, function(err, res){
       var itemName = res[0].product_name;
       var stockQuantity = res[0].stock_quantity;
       var price = res[0].price;
       if(quantity <= stockQuantity){
           updateQuantity(itemId, itemName, quantity, stockQuantity,price);
       }
       else{
           console.log("Insufficient Quantity!");
       }
    });
  }

  function updateQuantity(itemId,itemName,quantity,stockQuantity,price){
       var updatedQuantity = stockQuantity - quantity; 
       var query = connection.query("UPDATE products SET ? WHERE ?", 
       [
        {stock_quantity: updatedQuantity},
        {item_id: itemId}
       ], 
       function(err, res){
         console.log("Your Invoice:");
         console.log(itemName+"............"+quantity);
         console.log("Totol cost: $"+price+" x "+quantity+" = $"+(price*quantity));
    });
  }