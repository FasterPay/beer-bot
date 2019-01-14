
const http = require("request");
const syncRequest = require('sync-request');

const initiatePayment =  function(cart, email){
  var payload = {
    cart: cart,
    email: email,
  };

  http.post({
    uri: apiBaseUrl + '/initiate-payment.php',
    json: payload
  }, function(error, response, body){
    console.log(body);
    return body;
  });
};

const getLastOrderStatus = function(email){
  var payload = { email: email };
  var jsonResponse = syncRequest("POST", apiBaseUrl + '/check-payment-status.php', { json: payload });
  return JSON.parse(jsonResponse.getBody('utf8'));
};

exports.initiatePayment = initiatePayment;
exports.getLastOrderStatus = getLastOrderStatus;
