DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(20,2) NULL,
  stock_quantity INT NULL,
  product_sales INT DEFAULT 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs INT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES
("Virtues", 100),
("Vices", 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Honor", "Virtues", 100.00, 2), 
("Courage", "Virtues", 3.11, 3), 
("Compassion", "Virtues", 3.25, 100),
("Respect", "Virtues", 33.23, 1),
("Loyalty", "Virtues", 23.25, 50),
("Lust", "Vices", 3.20, 15),
("Wrath", "Vices", 3.25, 7),
("Greed", "Vices", 0.00, 200),
("Pride", "Vices", 30.25, 1),
("Spicy Food", "Vices", 1.25, 2);