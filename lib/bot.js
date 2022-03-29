/* This class handles the framework for taking input
 from a client passing it to a router and then triggering
 an action for an application.
*/

const assert = require('assert');

/**
Constructs a new Bot with a delegate.

 - parameter delegate: The Delgate for the bot.
 */
function Bot(config) {

  assert(config, "No config was provided.")
  assert(config.client, "No client set on configuration.")
  assert(config.router, "No router set on configuration.")

  /* Connect all the pipework and ask for both the
     client and router from the application */
  this.client = config.client;
  this.router = config.router.bind(config);
  this.contextStore = config.contextStore

  /* Storage for actions and middleware */
  this.actions = {};
  this.middlewares = [];

  /* Register default speak action */
  this.action("speak", this.speak.bind(this))
}

Bot.prototype.action = function(name, func) {
  this.actions[name] = func;
}

Bot.prototype.dispatch = function(action, request) {
  var func = this.actions[action.name];
  assert(func, 'Action ' + action.name + ' not registered')

  this.middlewares.forEach(function(middleware){
    request.context = middleware(action, request)
  })

  return func(action.payload, request)
}

Bot.prototype.speak = function(payload, request) {
  this.client.speak(payload.message, request.user)
  return request.context
}

Bot.prototype.use = function(middleware) {
  this.middlewares.push(middleware);
}

/**
 Call this to start the bot.
 */
Bot.prototype.start = function() {
  this.startContextStore(this.startClient.bind(this));
};

Bot.prototype.startContextStore = function(callback) {
  if (this.contextStore) {
    this.contextStore.start(callback)
  } else {
    callback()
  }
}

Bot.prototype.startClient = function() {
  assert(this.client.start, "Client doesn't implement start method.")

  // Start the client so the bot can listen to input.
  this.client.start(this)
}

Bot.prototype.didRecieveMessage = function(message, user, callback) {

  var contextHandler = function(context) {

    var request = {
      context: context,
      message: message,
      user: user
    }

    this.router(this, request, this.createRouterDidFinishHandler(user, callback).bind(this))
  }

  var context = this.contextForUser(user, contextHandler.bind(this))
}

Bot.prototype.createRouterDidFinishHandler = function(user, callback) {
  return function (newContext) {

    this.storeContextForUser(newContext, user)

    if (callback) {
      callback()
    }
  }
}

Bot.prototype.contextForUser = function(user, callback) {
  if (this.contextStore) {
    this.getContextForUser(user, callback);
  } else {
    callback({})
  }
}

Bot.prototype.getContextForUser = function(user, callback) {
  this.contextStore.get("conversation_" + user.conversationID, function(reply) {
    if (reply) {
      callback(reply);
    } else {
      callback({});
    }
  })
}

Bot.prototype.storeContextForUser = function(newContext, user) {
  if (this.contextStore) {
    this.contextStore.set("conversation_" + user.conversationID, newContext)
  }
}

module.exports = Bot
