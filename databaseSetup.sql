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
("Vices", 100)

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Honor", "Virtues", 100.00, 2), 
("Courage", "Virtues", 3.10, 2), 
("Compassion", "Virtues", 3.25, 75),
("Respect", "Virtues", 3.25, 75),
("Loyalty", "Virtues", 3.25, 75),
("Lust", "Vices", 3.25, 75),
("Wrath", "Vices", 3.25, 75),
("Greed", "Vices", 0.00, 75),
("Pride", "Vices", 3.25, 75),
("Spice Food", "Vices", 3.25, 75);