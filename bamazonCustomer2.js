var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');
var chalk = require("chalk");
var shoppingCart = [];

var data = [];
var idArray = [];
var zeroStock = 0;
var output;
var headerText = chalk.cyanBright;

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
    idArray = [];
    var query = connection.query("SELECT * FROM products WHERE stock_quantity > ? ORDER BY product_name", [zeroStock],function(err, res){
        console.log(chalk.yellow("\nList of Bamazon Products for Sale"));
        var header = [headerText('Item ID'),headerText('NAME'),headerText('PRICE')];
        data.push(header);
        for (var i = 0; i < res.length; i++) {
          var item_id = res[i].item_id;
          var product_name = res[i].product_name;
          var price = res[i].price;
          var item = [item_id,product_name,"$"+price];
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
            if(Number.isInteger(parseInt(input.trim()))){
              if(parseInt(input.trim())<0){
                return "Quantity cannot be zero. Please enter a valid quantity:"
              }
              return true;
            }
            return "Please enter a number:";
          }
        })    
       .then(answers => {
           var quantity = answers["quantity"].trim();
           showShoppingCart(itemId, quantity);
      });
  }

  var Product = function(itemId, itemName, price, quantity){
    this.itemId = itemId;
    this.itemName = itemName;
    this.price = price;
    this.quantity = quantity;
  }

  
  function showShoppingCart(itemId, quantity){
    var query = connection.query("SELECT * FROM products WHERE ?", { item_id: itemId}, function(err, res){
        var itemName = res[0].product_name;
        var price = res[0].price; 
        var stockQuantity = res[0].stock_quantity;
        var quant = parseInt(quantity);
        if(quant <= stockQuantity){
            var found= 0;
            for(var i = 0; i<shoppingCart.length;i++){
              var value = shoppingCart[i].itemId;
              if(value === itemId){
                shoppingCart[i].quantity+=quant;
                found = 1;
                break;
              }
            }
            if(found ===0){
              var product = new Product(itemId,itemName, price, quant);
              shoppingCart.push(product);
            }
          }
          else{
            console.log("Sorry. We currently do not have sufficient quantity in our stock.");
         }

        //console.log(shoppingCart);
        var total=0;
        console.log("Your shopping cart:");
        console.log("-----------------------");
        for(var i = 0; i < shoppingCart.length; i++){
          total+=shoppingCart[i].price*shoppingCart[i].quantity;
          console.log(shoppingCart[i].itemId+" "+
          shoppingCart[i].itemName+"("+shoppingCart[i].quantity+")...."+"$"+
          (shoppingCart[i].price*shoppingCart[i].quantity).toFixed(2));
      }   
      console.log("-----------------------");
      console.log("Total: $"+total.toFixed(2)+"\n");
      shoppingMenu();
    });
  }

  function shoppingMenu(){
    inquirer
    .prompt([
        {
        type: 'list',
        name: 'menuItem',
        message: 'What do you want to do next?',
        choices: [
            'Continue Shopping',
            'Place Order',
            'Exit'
        ]}
   ])
    .then(answers => {
        switch(answers.menuItem){
            case "Continue Shopping":
              displayItems();
              break;
            case "Place Order":
              buyItem();
              break;
            case "Exit":
              connection.end();
              console.log("Logged out.");
              process.exit(0);
              break;
        }
    });

  }

  var index = 0;

  function buyItem(){  
      var query = connection.query("UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ?"
      +" WHERE item_id = ?", 
      [shoppingCart[index].quantity,shoppingCart[index].price*shoppingCart[index].quantity,shoppingCart[index].itemId], 
      function(err, res){
        index++;
        if(index<shoppingCart.length){
           buyItem();
        }
        else{
          console.log("Your order is placed!\n");
          console.log("Your invoice:");
          console.log("-----------------------");
          var total = 0;
          for(var i = 0; i < shoppingCart.length; i++){
              total+=shoppingCart[i].price*shoppingCart[i].quantity;
              console.log(shoppingCart[i].itemId+" "+
              shoppingCart[i].itemName+"("+shoppingCart[i].quantity+")...."+"$"+
              (shoppingCart[i].price*shoppingCart[i].quantity).toFixed(2));
          }   
          console.log("-----------------------");
          console.log("Total: $"+total.toFixed(2)+"\n");
          console.log("Thank you for shopping with bamazon");
          index = 0;
          shoppingCart = [];
          connection.end();
          process.exit(0);
        }
        
    });
        
}

// function buyAnother(){
//   inquirer.prompt([
//     {
//       type: "confirm",
//       name: "continue",
//       message: "Do you want to buy another item?"
//     }, 
//   ]).then(function(user){
//     if(user.continue){
//        displayItems();
//     }
//     else{
//       connection.end();
//       console.log("See you soon.");
//       process.exit();
//     }
//   });
// }