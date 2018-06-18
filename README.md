# Bamazon
Bamazon is like an Amazon-like storefront built using MySQL and node.js. This Command Line Interface (CLI) app will take in orders from customers and deplete stock from the store's inventory. It can also keep track of product sales across the store's departments and then provide a summary of product sales and total profit of all departments in the store.


## Steps to Configure Bamazon on Local Machine
1. <a href="https://nodejs.org/en/">Download and install Node.js</a> on the local development machine. Test that Node.js is installed by typing the command `node` at the command line. A command prompt should appear waiting for additional commands. Type Ctrl+c twice to exit Node.js command line interpreter.
2. Download MySQL server AND <a href = "https://dev.mysql.com/doc/workbench/en/wb-installing-windows.html">MySQL Workbench</a>.

## Getting Started
1. Clone this git repository using the steps mentioned on the link below: https://help.github.com/articles/cloning-a-repository/.
2. Open another terminal and navigate to inside the project folder on terminal, where you would see a package.json file. 
3. Type `npm install` for installing all the project dependencies and hit enter. 
4. Run the `bamazon_schema.sql` and `bamazon_seeds.sql` which are located in sql_scripts folder on your MySQL Workbench. 
5. Go to `connection.js` file and make sure to add your MySQL password in blank password field if you had set any during installation.

And you are all set to use Bamazon!

## Running the Tests
There are three(3) kinds of users of the system:
* Customer  
* Manager
* Supervisor  

Below are the detailed steps for testing the application for each of these users.  
### <h3>CUSTOMER</h3>
1. Open terminal and navigate to inside the project folder on terminal, where you would see a `bamazonCustomer.js` file.
2. Type `node bamazonCustomer.js` on your terminal and hit enter. 
![Customer Demo](https://user-images.githubusercontent.com/30298841/41516495-06e7fad2-726a-11e8-80d3-3e26ed825569.gif)  
3. Test Cases:
   * Steps to Buy a Product:
     * After completing step 2, you will see a list of products available for sale including item ID, item name, unit price, and quantity .
     * Enter the item ID of the product you want to buy and press enter.
        * Validation : Failure to provide correct item ID will show an error message asking for valid item ID.
     * Enter the quantity of product and hit enter.
        * Validation : 
           * Quantity field cannot be left blank, must be a number, and greater than 0.
           * If the entered quantity is greater than the available stock, the app will log a message and prevent the order from going through.
     * You will see a shopping cart listing the product you want to buy for review.
     * Next if you type `Y`, your order will be confirmed and you will see an invoice.
     * Else, type `N` if you want to cancel the order and exit the application.






### <h3>MANAGER</h3>
1. Open terminal and navigate to inside the project folder on terminal, where you would see a `bamazonCustomer.js` file.
2. Type `node bamazonManager.js` on your terminal and hit enter. 
![Manager Demo](https://user-images.githubusercontent.com/30298841/41520847-81681336-7284-11e8-8e45-1c32f3ae26fe.gif)
3. Test Cases:
   * Steps to View Products for Sale:
   * Steps to View Low Inventory:
   * Steps to Add to Inventory:
   * Steps to Add New Product:



### <h3>SUPERVISOR</h3>
1. Open terminal and navigate to inside the project folder on terminal, where you would see a `bamazonCustomer.js` file.
2. Type `node bamazonSupervisor.js` on your terminal and hit enter. 
![Supervisor Demo](https://user-images.githubusercontent.com/30298841/41522085-7da55024-7289-11e8-9d8e-c56fe7c9a72c.gif)
3. Test Cases:
   * Steps to View Product Sales by Department:
   * Steps to Create New Department: