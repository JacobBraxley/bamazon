var mysql = require("mysql");
var inquirer = require("inquirer");


const hostName = process.env.HOST || "192.168.99.103";
const hostPort = process.env.PORT || 3306;
const hostUser = process.env.USER || "root"
const userPass = process.env.PASS || "docker";
const database = "bamazon";


let purchaseTotal = 0;

var connection = mysql.createConnection({
  host: hostName,
  port: hostPort,
  user: hostUser,
  password: userPass,
  database: database
});

connection.connect(function(err) {
    if (err) { 
        throw err; 
    } else {
        promptAction();
    }
});

function promptAction() {
    inquirer.prompt([{
        name: "action",
        type: "list",
        choices: [
            "View Products for Sale",    
            "View Low Inventory",            
            "Add to Inventory",            
            "Add New Product",
            "Exit"
        ],
        message: "Please enter the action you'd like to take."
    }])
    .then(function(answer) {
      switch(answer.action) {
        case "Exit":
          process.exit();
        case "View Low Inventory":
            displayLowInventory();
            break;
        case "Add to Inventory":
            addInventory();
            break;     
        case "Add New Product":
            addNewProduct();
            break;
        case "View Products for Sale":
        default:
            displayProductsForSale();
      }
    });
    
}

function displayProductsForSale() {
    connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, res) {
        if(err) { 
            throw err; 
        } else {
            res.forEach(element => {
                //Print options.
                console.log(`Id(${element.item_id}) | Product (${element.product_name}) | Price ($${element.price}) | Stock (${element.stock_quantity})`);
            });
            promptAction();
        }
    });
}

function displayLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if(err) { 
            throw err; 
        } else {
            res.forEach(element => {
                //Print low Inventory.
                console.log(`Id(${element.item_id}) | Product (${element.product_name}) | Price ($${element.price}) | Stock (${element.stock_quantity})`);
            });
            promptAction();
        }});
}

function addInventory() {
    //Ask Manage which to item to add stock for.
    inquirer.prompt([{
        name: "id",
        message: "Please enter the id of the item you'd like to stock.  (0 to Exit)"
    }, {
        name: "number",
        message: "How many would you like to add?"
    }])
    .then(function(answer) {
        if(answer.id == 0) { process.exit(); }
        connection.query("SELECT * FROM products WHERE item_id = ?", answer.id, function(err, res) {
            if(err) { 
                throw err; 
            } else {
                if(res.count == 0) {
                    console.log("Could not find item.  Please try again.");
                    promptAction();
                    return;
                } else {
                    //Update database with new quantity.
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                        {
                            stock_quantity: Number(res[0].stock_quantity) + Number(answer.number)
                        },
                        {
                            item_id: answer.id
                        }
                        ],
                        function(inner_err) {
                            if(inner_err) { 
                                throw inner_err;
                            } else {
                                promptAction();
                                return;
                            }
                        }
                    );
                }
            }
        });
    });    
}



function addNewProduct() {
    inquirer.prompt([{
        name: "name",
        message: "Please enter the name of the new product."
    }, {
        name: "department",
        message: "Please enter the name of the department to add this to."
    }, {
        name: "price",
        message: "Please enter the price of the item."
    }, {
        name: "stock",
        message: "Please enter the initial stock."
    }])
    .then(function(answer) { 
        connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${answer.name}","${answer.department}", ${answer.price}, ${answer.stock})`, function(err, res) {
            if(err) {
                throw err;
            } else {
                promptAction();
            }
        });
    });

}