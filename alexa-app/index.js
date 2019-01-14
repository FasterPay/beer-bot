

const Alexa = require("ask-sdk");
const Cart = require("./cart.js");
const OrderItem = require("./orderitem.js");
const Cart = require("./cart.js");
const api = require("./api.js");

//Variable Constants
const email = "johndoe@example.com" // TODO: Fetch this email from Amazon's API or use Account Linking for Alexa.
const apiBaseUrl = "https://someapiservice.com"; // Replace this with your own rest API service.

var myCart = null;

// Handler for LaunchIntent / Launch Request Ex. "Alexa, begin <invocation-name>"
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    // conditions to determine the requests this handler can handle
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
  },
  handle(handlerInput){
    // execution logic for the handler
    const speechOutput =
        "Welcome to Ernest's Bar, What should I order for you!";

    console.log("Invoking LaunchRequestHandler");
    return handlerInput.responseBuilder
        .speak(speechOutput)
        .reprompt(speechOutput)
        .getResponse();
  }
};

// Handler for OrderIntent Ex. "Alexa, ask <invocation-name> order me a beer"
const OrderHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" &&
        ( request.intent.name === "OrderIntent" ||
          request.intent.name === "AMAZON.StartOverIntent" ||
          request.intent.name === "AMAZON.YesIntent");
  },
  handle(handlerInput) {
    var itemName = handlerInput.requestEnvelope.request.intent.slots.beer.value;
    console.log(handlerInput.requestEnvelope.request);
    myCart = new Cart();
    myCart.addItem(new OrderItem(itemName, 0.5, 1));
    api.initiatePayment(myCart, email);
    const speechOutput = "I've added this to your cart, your total amount is USD "+ myCart.totalPrice +", A payment request has been initiated to your registered emailId. Please check your email for the Payment Instructions";
    return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();
  }
};

// Handler for OrderStatusIntent Ex. "Alexa, ask <invocation-name> where is my order"
const OrderStatusHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" &&
        ( request.intent.name === "OrderStatusIntent");
  },
  handle(handlerInput) {

    var response = api.getLastOrderStatus(email);

    var merchant_order_id = response.paymentData.paymentOrder.merchant_order_id.split("").join(" ");

    var speechOutput = "Your last order #"+ merchant_order_id + " is "
    if(response.paymentData.paymentOrder.status == "successful"){
      speechOutput += "successful! Your beer is on the way!";
    } else {
      speechOutput += "failed. Please try and order again. If you have already paid, a refund will be initiated shortly!";
    }

    return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();
  }
};


// Handler for Help Intent
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say ask <invocation-name> order me a beer';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

// Handler for CancelIntent and StopIntent
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
};

// Handler for SessionEndedRequest
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

// Handler for Errors.
const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log("Error handled: ");
      return handlerInput.responseBuilder
        .speak('Sorry, I can\'t understand the command. Please say again.')
        .reprompt('Sorry, I can\'t understand the command. Please say again.')
        .getResponse();
    },
};


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
      LaunchRequestHandler,
      OrderHandler,
      OrderStatusHandler,
      ErrorHandler,
      SessionEndedRequestHandler,
      CancelAndStopIntentHandler,
      HelpIntentHandler
    )
    .lambda();
