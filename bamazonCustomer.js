var inquirer = require("inquirer");
var connection = require("./connection.js");
const {table} = require('table');
var chalk = require("chalk");

var data = [];
var idArray = [];
var cart = [];
var zeroStock = 0;
var output;
var headerText = chalk.cyanBright;
var welcome = chalk.magentaBright;
var subheader = chalk.yellow;
var error = chalk.redBright;
var success = chalk.greenBright;


  connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    displayWelcomeMessage();
    displayItems();
  });

  function displayWelcomeMessage(){
    console.log(welcome("\n~+~+~+ Dear Customer. Welcome to Bamazon!! +~+~+~\n"));
  }

  function displayItems(){
    data = [];
    idArray = [];
    var query = connection.query("SELECT * FROM products WHERE stock_quantity > ? ORDER BY product_name", [zeroStock],function(err, res){
        console.log(subheader("Here's a list of products to shop"));
        var header = [headerText('Item ID'),headerText('NAME'),headerText('UNIT PRICE'), headerText('QUANTITY')];
        data.push(header);
        for (var i = 0; i < res.length; i++) {
          var item_id = res[i].item_id;
          var product_name = res[i].product_name;
          var price = res[i].price;
          var stockQuantity = res[i].stock_quantity;
          var item = [item_id,product_name,"$"+price,stockQuantity];
          data.push(item);
          idArray.push(item_id);
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
          message: "Please enter item ID of the product you want to buy:",
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
           var itemId = answers["itemId"].trim();
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
           checkStock(itemId, quantity);
      });
  }
  
  function checkStock(itemId, quantity){
    var query = connection.query("SELECT * FROM products WHERE ?", { item_id: itemId}, function(err, res){ 
      itemId = res[0].item_id;
      var itemName = res[0].product_name;
      var stockQuantity = res[0].stock_quantity;
      var price = res[0].price;
      if(err){
         console.log(error("\nSorry. Order could not be processed"));
      }
      else{
        if(quantity > stockQuantity){
          console.log(error("\nSorry. Your order could not be processed."));
          console.log(error("We currently do not have sufficient quantity in our stock.\n"));
          buyAnother();              
        }
        else{ 
          console.log("\nYour shopping cart:");
          cart = [];
          var header = [headerText('Item ID'),headerText('NAME'),headerText('QUANTITY'),headerText('UNIT PRICE'),headerText('TOTAL PRICE')];
          var cartItem = [itemId, itemName, quantity,"$"+price,"$"+(price*quantity).toFixed(2)];
          cart.push(header);
          cart.push(cartItem);
          console.log(table(cart));
          checkout(res,quantity);
        }
      }  
    });
  }

  function checkout(res,quantity){
    var itemId = res[0].item_id;
    var itemName = res[0].product_name;
    var price = res[0].price;
    inquirer.prompt([
      {
        type: "confirm",
        name: "placeOrder",
        message: "Do you want to proceed to check-out?"
      }, 
     ]).then(function(user){
        if(user.placeOrder){
          var query = connection.query("UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ?"
            +" WHERE item_id = ?", 
            [quantity, price * quantity, itemId], 
            function(err, res){
              if(err){
                console.log(error("\nSorry. Order could not be processed.\n"));
              }
              else{
                console.log(success("\nYour order is placed!\n"));
                console.log("Your Invoice:");
                console.log(table(cart));
                console.log("Thank you for shopping with Bamazon!\n");
              }
              buyAnother();
            });
        }
        else{
          console.log(success("\nYour order is not placed.\n"));
          buyAnother();
        }
     });
  }

function buyAnother(){
  inquirer.prompt([
    {
      type: "confirm",
      name: "continue",
      message: "Do you want to buy another item?"
    }, 
  ]).then(function(user){
    if(user.continue){
       displayItems();
    }
    else{
      connection.end();
      console.log("Come back soon!");
      process.exit();
    }
  });
}