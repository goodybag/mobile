/*
* Handlebar Helpers
*/

//format number to be precise for currency (2 decimal points)
Handlebars.registerHelper("dollars", function(dollars) {
  return "$"+parseFloat(dollars).toFixed(2);
});
//format number to be precise for currency (2 decimal points)
Handlebars.registerHelper("dollarsNoUnit", function(dollars) {
  return parseFloat(dollars).toFixed(2);
});
Handlebars.registerHelper("dollarsToCents", function(dollars) {
  return parseInt(dollars*100);
});