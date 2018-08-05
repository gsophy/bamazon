var mysql = require("mysql");
var inquirer = require("inquirer");
var all = "";
var selection = ""
var amount = 0

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("active connection to my data base" + connection.threadId);
    displayAll();
    
});

function displayAll() {
    connection.query("Select * from products", function (err, res) {
        all = res;
        if (err) throw err;
        console.log("WELCOME TO GUACAMOLE STORE");

        for (let i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" +
            res[i].price + " | " + res[i].stock_quantity + " | ")
        }
        askForProduct();
    }
    )
};

function askForProduct() {
    inquirer
        .prompt({
            name: "action",
            type: "input",
            message: "What is ID of the product they would like to buy",
        })
        .then(function (answer) {
            //console.log(all);
            selection = all[parseInt(answer.action)-1];
            console.log("You picked " + selection.product_name);
            quantity()
        })
}  

function quantity() {
    inquirer
        .prompt({
            name: "amount",
            type: "input",
            message: "How many " + selection.product_name + "s would you like?",
        })
        .then(function (answer) {
            //console.log(all);
            amount = answer.amount
            // console.log("You picked " + amount + " " + selection + "(s)");
            if (amount > selection.stock_quantity) {
                console.log("We don't have that many in stock.  Try again.");
                quantity();
            }
            else {
                console.log("You picked " + amount + " " + selection.product_name);
                orderProcessing();
            }
        })
}  

function orderProcessing() {
    var val = selection.stock_quantity - amount
    connection.query("Update products set stock_quantity = " + val + " where product_name = '" + selection.product_name + "'", function (err, res) {
        if(err){
            throw err
        }else{
        console.log("Stock Quantity for " + selection.product_name + " changed to " + val + " successfully!")
        displayAll()
        }
    }) 
}