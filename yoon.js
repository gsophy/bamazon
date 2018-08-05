// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

// Global variable to keep track of Purchase Running Total
var runningTotal = 0;

// Set up for MySQL database connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// Main function for application
var shopInit = function() {
	// First step of displaying available items
	connection.query("SELECT * FROM products", function(err, res) {
	  if (err) throw err;

	  console.log("WELCOME TO YOON'S STORE! ITEMS FOR SALE:");
	  
	  // Runs through each item in database
	  for(var i = 0; i < res.length; i++) {
	  	console.log(res[i].id + " | " + res[i].product_name + " | $" + res[i].price.toFixed(2));
	  }

	  inquirer.prompt([
	  	{
	  		type: "input",
	  		name: "itemId",
	  		message: "Enter the ID number of the product you'd like to buy:",
	  		validate: function(value) {
	  			if(isNaN(value) === false && value > 0 && value < res.length + 1) {
	  				return true;
	  			} else {
	  				return false;
	  			}
	  		}
	  	},
	  	{
	  		type: "input",
	  		name: "quantityDemanded",
	  		message: "How many would you like to buy?",
	  		validate: function(value) {
	  			if(isNaN(value) === false && value > 0) {
	  				return true;
	  			} else {
	  				return false;
	  			}
	  		}
	  	},
	  ]).then(function(answers) {
	  	var itemId = answers.itemId;
          var quantityDemanded = answers.quantityDemanded;
    
          console.log(answers);

	  	// itemId different from index of item in array
	  	if(quantityDemanded > res[itemId - 1].stock_quantity) {
	  		console.log("Insufficient quantity!");

	  		// Loop the app so that user can attempt another purchase
	  		inquirer.prompt([
	  			{
	  				type: "confirm",
	  				name: "confirm",
	  				message: "Would you like to try and make another purchase?"
	  			}
	  		]).then(function(answers) {
	  			if(answers.confirm) {
	  				shopInit();
	  			}
	  		});
	  	} else {
	  		// If quantity to purchase is valid, then update database with new stock quantity
	  		connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantityDemanded, itemId], function(err, res) {});

	  		// Shows purchase total and running total of session's order
	  		console.log("Your purchase total is $" + (res[itemId - 1].price * quantityDemanded).toFixed(2));

	  		runningTotal = runningTotal + (res[itemId - 1].price * quantityDemanded);

	  		console.log("Your running total is $" + runningTotal.toFixed(2));

	  		// Option to make another purchase after successful purchase
	  		inquirer.prompt([
	  			{
	  				type: "confirm",
	  				name: "confirm",
	  				message: "Would you like to make another purchase?"
	  			}
	  		]).then(function(answers) {
	  			if(answers.confirm) {
	  				shopInit();
	  			}
	  		});
	  	}
	  });
	});
};

// Initialize
shopInit();