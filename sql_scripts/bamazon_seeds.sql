INSERT INTO departments (department_name, over_head_costs)
VALUES ("Beauty & Personal Care",30000),
("Toys, Kids & Baby",20000),
("Electronics & Computers", 20000),
("Handmade",40000),
("Books & Audible",3000),
("Pet Supplies",20000),
("Sports & Outdoors",10000),
("Clothing, Shoes & Jewellery",10000),
("Automotive & Industrial",10500),
("Home & Kitchen",30000);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("BP1","BBs Lip Balm","Beauty & Personal Care",4.99,3),
("TK1","Play-Doh","Toys, Kids & Baby",7.99,300),
("EC1","DELL XPS-12 Notebook","Electronics & Computers",1200,90),
("HM1","Circle Crossbody Purse","Handmade",205,5),
("BA1","Harry Potter(Set 1-7)","Books & Audible",4.99,10),
("PS1","Dry Dog Food","Pet Supplies",44.50,500),
("SP1","Beach Cruiser Bicycle","Sports & Outdoors",163.55,2),
("CS1","Diamond Necklace","Clothing, Shoes & Jewellery",550,100),
("AI1","Front Track Bar","Automotive & Industrial",250,200),
("EC2","DELL XPS-12 Notebook","Electronics & Computers",1150,50);

SELECT * FROM departments;

SELECT * FROM products;

