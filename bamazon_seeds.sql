INSERT INTO departments (department_name, over_head_costs)
VALUES ("Beauty & Personal Care",30000),
("Toys, Kids & Baby",20000),
("Electronics & Computers", 20000),
("Handmade",10500),
("Books & Audible",3000),
("Pet Supplies",20000),
("Sports & Outdoors",10000),
("Clothing, Shoes & Jewellery",100000),
("Automotive & Industrial",100050),
("Home & Kitchen",30000);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("BP944RUR","BBs Lip Balm","Beauty & Personal Care",4.99,10),
("KB636HHK","Play-Doh","Toys, Kids & Baby",7.99,30),
("EC964BXR","DELL XPS-12 Notebook","Electronics & Computers",1200,5),
("HM744TUT","Circle Crossbody Purse","Handmade",205,5),
("BA235ETY","Harry Potter(Set 1-7)","Books & Audible",4.99,10),
("PS565URE","Dry Dog Food","Pet Supplies",44.50,13),
("SO944WER","Beach Cruiser Bicycle","Sports & Outdoors",163.55,3),
("CS356HYE","Diamond Necklace","Clothing, Shoes & Jewellery",550,10),
("AI567UUY","Front Track Bar","Automotive & Industrial",250,20),
("HK054ETR","Crock Slow Cooker","Home & Kitchen",35,5);

SELECT * FROM departments;

SELECT * FROM products;

