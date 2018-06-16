var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');
var chalk = require("chalk");

var data = [];
var idArray = [];
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
    data = [];
    var query = connection.query("SELECT * FROM products WHERE stock_quantity > 0 ORDER BY product_name", function(err, res){
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
         for(var i = 1; i < data.length; i++){
           idArray.push(data[i][0]);
         }
         selectItem();
    });
  }

  function selectItem(){
    inquirer
    .prompt({
          type: 'input',
          name: 'itemId',
          message: "Please enter 8 digit item ID of the product you want to buy:",
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
           buyItem(itemId, quantity);
      });
  }

  function buyItem(itemId, quantity){
    inquirer.prompt([
      {
        type: "confirm",
        name: "placeOrder",
        message: "Do you want to place an order?"
      }, 
    ]).then(function(user){
    if(user.placeOrder){
        var query = connection.query("SELECT * FROM products WHERE ?", { item_id: itemId}, function(err, res){
          var itemName = res[0].product_name;
          var stockQuantity = res[0].stock_quantity;
          var price = res[0].price;
              if(quantity <= stockQuantity){
                var updatedQuantity = stockQuantity - quantity; 
                var query = connection.query("UPDATE products SET ? WHERE ?", 
                [
                {stock_quantity: updatedQuantity},
                {item_id: itemId}
                ], 
                function(err, res){
                  console.log("\nYour order is placed!");
                  console.log("Here's your Invoice:");
                  console.log(itemName+"("+quantity+")");
                  console.log("Totol cost: $"+price+" x "+quantity+" = $"+(price*quantity));
                  console.log("Thank you for shopping with Bamazon!");
                  buyAnother();
            });
          }
          else{
              console.log("Insufficient Quantity!");
              buyAnother();
          }        
      });
    }
    else{
      console.log("Your order is not placed");
      buyAnother();
    }
  });
}

function buyAnother(){
  inquirer.prompt([
    {
      type: "confirm",
      name: "continue",
      message: "Do you want to continue shopping?"
    }, 
  ]).then(function(user){
    if(user.continue){
       displayItems();
    }
    else{
      connection.end();
      process.exit();
    }
  });
}