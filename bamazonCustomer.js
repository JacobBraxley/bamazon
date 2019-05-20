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
        promptPurchase();
    }
});

function promptPurchase() {
    //Read options.
    connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, res) {
        if(err) { 
            throw err; 
        } else {
            res.forEach(element => {
                //Print options.
                console.log(`Id(${element.item_id}) | Product (${element.product_name}) | Price ($${element.price}) | Stock (${element.stock_quantity})`);
            });

            //Ask User which to buy.
            inquirer.prompt([{
                name: "id",
                message: "Please enter the id of the item you'd like to buy.  (0 to Exit)"
            }, {
                name: "number",
                message: "How many would you like to buy?"
            }])
            .then(function(answer) {
              if(answer.id == 0) { process.exit(); }
              purchase(answer.id, answer.number);
            });
        }
    });
}

function purchase(id, purchase_quantity) {
    connection.query("SELECT * FROM products WHERE item_id = ?", id, function(err, res) {
        if(err) { 
            throw err; 
        } else {
            if(res.count == 0) {
                console.log("Could not find item.  Please try again.");
                promptPurchase();
            } else {
                if (res[0].stock_quantity < purchase_quantity) {
                    console.log("Insufficient quantity!");
                    promptPurchase();
                } else {
                    //Update database with new quantity.
                    connection.query("UPDATE products SET ? WHERE ?",
                      [
                        {
                          stock_quantity: res[0].stock_quantity - purchase_quantity,
                          product_sales: (res[0].price * purchase_quantity) + res[0].product_sales
                        },
                        {
                          item_id: id
                        }
                      ],
                      function(err) {
                        if(err) { 
                            throw err;
                        } else {
                            purchaseTotal += (purchase_quantity * res[0].price);
                            console.log("Purchase made.  Total spent: "+purchaseTotal);
                            promptPurchase();
                        }
                      }
                    );
                }
            }
        }
    });
}