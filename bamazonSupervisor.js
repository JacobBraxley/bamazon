var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table')


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
            "View Product Sales by Department",    
            "Create New Department",
            "Exit"
        ],
        message: "Please enter the Action you'd like to take."
    }])
    .then(function(answer) {
      switch(answer.action) {
          case "Exit":
              process.exit();
        case "Create New Department":
            createNewDepartment();
            break;     
        case "View Product Sales by Department":
        default:
            displaySalesByDepartment();
      }
    });
    
}
function displaySalesByDepartment() {
    connection.query("SELECT department_id, department_name, SUM(product_sales) FROM products GROUP BY department_name", function(err, res) {
        if(err) { 
            throw err; 
        } else
            console.table(res);
        }
    });
    
}
//       connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//       var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
//       query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
//       query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

function createNewDepartment() {

}
