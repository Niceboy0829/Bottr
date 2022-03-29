var Bot = require('./bot')
var FacebookMessengerClient = require('./facebook-messenger-client')
var Server = require('./server')
var TwilioClient = require('./twilio-client')
var TwitterClient = require('./twitter-client')
var WebhookClient = require('./webhook-client')
var WebsocketClient = require('./websocket-client')

Bot.prototype.listen = function(port) {
  var serverPort = port || process.env.PORT || 3000
  var server = new Server()
  server.use(this)
  server.listen(serverPort)
  console.log('Bot is listening on port ' + serverPort)
}

module.exports = {
  Bot: Bot,
  FacebookMessengerClient: FacebookMessengerClient,
  Server: Server,
  TwilioClient: TwilioClient,
  TwitterClient: TwitterClient,
  WebhookClient: WebhookClient
}
