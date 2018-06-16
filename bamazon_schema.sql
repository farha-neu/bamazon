DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id VARCHAR(8) NOT NULL UNIQUE PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL
);

DESCRIBE products;