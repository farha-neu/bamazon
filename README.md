# Bamazon
Bamazon is like an Amazon-like storefront built using MySQL and node.js. This Command Line Interface (CLI) app will take in orders from customers and deplete stock from the store's inventory. It can also keep track of product sales across the store's departments and then provide a summary of product sales and total profit of all departments in the store.


## Steps to Configure Bamazon on Local Machine
1. <a href="https://nodejs.org/en/">Download and install Node.js</a> on the local development machine. Test that Node.js is installed by typing the command `node` at the command line. A command prompt should appear waiting for additional commands. Type Ctrl+c twice to exit Node.js command line interpreter.
2. Download MySQL server AND <a href = "https://dev.mysql.com/doc/workbench/en/wb-installing-windows.html">MySQL Workbench</a>.

## Getting Started
1. Clone this git repository using the steps mentioned on the link below: https://help.github.com/articles/cloning-a-repository/.
2. Open another terminal and navigate to inside the project folder on terminal, where you would see a package.json file. 
3. Type `npm install` for installing all the project dependencies and hit enter. 
4. Run the `bamazon_schema.sql` and `bamazon_seeds.sql`(located in sql_scripts folder) on your MySQL Workbench. 
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
     * After completing step 2, you will see a list of products available for sale including item ID, item name, unit price, and quantity. 
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
1. Open terminal and navigate to inside the project folder on terminal, where you would see a `bamazonManager.js` file.
2. Type `node bamazonManager.js` on your terminal and hit enter. You will see a set of menu options:
    * View Products for Sale 
    * View Low Inventory 
    * Add to Inventory 
    * Add New Product
    * Exit

![Manager Demo](https://user-images.githubusercontent.com/30298841/41520847-81681336-7284-11e8-8e45-1c32f3ae26fe.gif)

3. Test Cases:
   * Steps to View Products for Sale:
     * Select `View Products for Sale` option with the help of arrow keys, and hit enter.
     * The app will list every available item: the item IDs, names, prices, and quantities. Items IDs with quantities less than five will be marked in red.
   * Steps to View Low Inventory:
     * Select `View Low Inventory` option with the help of arrow keys, and hit enter.
     * The app will list all items with an inventory count lower than five.
   * Steps to Add to Inventory:
     * Select `Add to Inventory` option with the help of arrow keys, and hit enter.
     * The app will display a prompt asking users to provide the item ID of the product they want to restock. Type the item ID and hit enter.
         * Validation : Failure to provide correct item ID will show an error message asking for valid item ID.
     * Then it will ask for the quantity they want to restock. Type the quantity, and hit enter.
          * Validation: Quantity field cannot be left blank, must be a number, and greater than 0.
     * Finally you need to confirm addition of new items to inventory. If you type `Y`, items will be added to inventory. Else, type `N` if you want to cancel addition.
   * Steps to Add New Product:
       * Select `Add New Product` option with the help of arrow keys, and hit enter.
       * Next type unique item ID, item name, department name, quantity, and price.
         * Validation: 
            * Quantity and price fields cannot be left blank, and must be a number.
       * If item ID already exists in the database, the request will not be processed. Else, new product will be created after typing `Y` when asked for confirmation.



### <h3>SUPERVISOR</h3>
1. Open terminal and navigate to inside the project folder on terminal, where you would see a `bamazonSupervisor.js` file.
2. Type `node bamazonSupervisor.js` on your terminal and hit enter. 
3. The application will list a set of menu options:
   * View Product Sales by Department
   * Create New Department
   * Exit
![Supervisor Demo](https://user-images.githubusercontent.com/30298841/41522085-7da55024-7289-11e8-9d8e-c56fe7c9a72c.gif)
3. Test Cases:
   * Steps to View Product Sales by Department:
     * Select `View Product Sales by Department` option with the help of arrow keys, and hit enter.
     * The app will display a table with department Id, department name, overhead cost of the department, product sales, and total profit.
   * Steps to Create New Department:
     * Select `Create New Department` from the prompt.
     * Enter department name, and overhead cost of the department when asked and hit enter.
     * Next, you will need to confirm creation of new department by typing `Y` when confirmation propmt is shown.
       * Validation: If department name matches with any of the existing deparment's name in the the database, the request will not be processed,    and a message will be logged: `"Department already exists. Try creating a new one."`