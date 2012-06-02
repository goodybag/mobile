/*
 * Handlebar Helpers
 */

//format number to be precise for currency (2 decimal points)
Handlebars.registerHelper("dollars", function(dollars) {
  return "$" + parseFloat(dollars).toFixed(2);
});
//format number to be precise for currency (2 decimal points)
Handlebars.registerHelper("dollarsNoUnit", function(dollars) {
  return parseFloat(dollars).toFixed(2);
});
Handlebars.registerHelper("dollarsToCents", function(dollars) {
  return parseInt(dollars * 100);
});

//separate a dollar amount into it's digits and return them as list items
Handlebars.registerHelper("moneyToList", function(amount) {
  amount = parseFloat(amount);
  amount = Math.floor(amount * 100) / 100; //getting a number precise to 2 decimal places
  amount = "" + amount;
  var split = amount.split(".");
  var dollars = "0";
  var change = "00";
  var html = "";

  if (split.length == 1) {
    dollars = split[0];
  } else if (split.length == 2) {
    dollars = split[0];
    change = split[1];
    if (change.length == 1) { //incase there is only 1 digit in change
      change += "0";
    } else if (change.length === 0) { //incase change is an empty string
      change = "00";
    }
  }


  for (var i = 0; i < dollars.length; i++) {
    html += "<span class='digit'>" + dollars[i] + "</span><span class='separator'></span>";
  }

  html += "<span class='digit decimal'>.</span><span class='separator'></span>";

  for (i = 0; i < change.length; i++) {
    if (i == change.length - 1) {
      html += "<span class='digit'>" + change[i] + "</span>";
    } else {
      html += "<span class='digit'>" + change[i] + "</span><span class='separator'></span>";
    }
  }

  return html;
});