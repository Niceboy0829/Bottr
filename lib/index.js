var Express = require('express');
var BodyParser = require('body-parser');
var ResponseMiddleware = require('./response-middleware');
var EventEmitter = require('./event-emitter');
var StringMatcher = require('./string-matcher');
var RegExpMatcher = require('./regexp-matcher');
var ArrayMatcher = require('./array-matcher');

var HubotBot = require('./hubot-bot');
var Context = require('./context');
var Middleware = require('./middleware');
var applySubjectToBot = require('./apply-subject-to-bot');

function Bot2() {

  this.server = Express()
  this.eventEmitter = new EventEmitter()

  this.server.use(BodyParser.json())
  this.server.use(new ResponseMiddleware())
  this.server.get('/', this.handleWebUIRequest.bind(this))
  this.server.post('/webhook', this.handleWebhookRequest.bind(this))
}

Bot2.prototype.handleWebUIRequest = function(req, res) {
  res.send('Web UI');
}

Bot2.prototype.handleWebhookRequest = function(req, res) {
  this.trigger('webhook', req, res);
}

Bot2.prototype.trigger = function(eventName) {
  console.log(eventName +' event triggered')
  this.eventEmitter.emit.apply(this.eventEmitter, arguments)
}

Bot2.prototype.listen = function(port) {
  console.log("Bot is listening to port " + port)
  this.server.listen(port);
}

Bot2.prototype.on = function(eventName, handler) {
  this.eventEmitter.addListener(eventName, handler)
}

Bot2.prototype.hears = function(pattern, handler) {

  var matcher = pattern

  if (pattern instanceof Array) {
    matcher = new ArrayMatcher()
  } else if (pattern instanceof String) {
    matcher = new StringMatcher(pattern)
  } else if(pattern instanceof RegExp) {
    matcher = new RegExpMatcher(pattern)
  }

  this.on('message_received', function(message) {
    if (matcher(message)) {
        handler(message)
    }
  })
}

Bot2.prototype.use = function(component) {
  component(this)
}

function Bot(config) {
  //adapterPath, adapterName, enableHttpd, botName, botAlias
  this.botkitBot = new HubotBot(config);
  this.middleware = new Middleware(this.botkitBot.storage, this.botkitBot.middleware)
}

Bot.prototype.on = function(event, callback) {
  this.botkitBot.on(event, this.createHandler(callback))
}

Bot.prototype.hears = function(patterns, eventFilter, middleware_or_callback, callback) {

  if (callback) {
      this.botkitBot.hears(patterns, eventFilter, middleware_or_callback, this.createHandler(callback))
  } else {
      this.botkitBot.hears(patterns, eventFilter, this.createHandler(middleware_or_callback))
  }
}

Bot.prototype.use = function(component) {
  component(this)
}

Bot.prototype.spawn = function(config) {
  this.botkitBot.spawn(config)
}

Bot.prototype.changeEars = function(ears) {
  this.botkitBot.changeEars(ears)
}

Bot.prototype.createHandler = function(callback) {

  var botkitBot = this.botkitBot

  return function(bot, subject) {

    var context = new Context(botkitBot.storage, subject)

    context.fetch().then(function() {
      var appliedBot = applySubjectToBot(bot, subject)
      callback(appliedBot, subject, context)
      context.save()
    }).catch(function(err){
      console.error(err)
    })
  }
}

module.exports = {
  Bot: Bot,
  Bot2: Bot2
}
