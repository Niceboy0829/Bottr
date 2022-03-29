const Http = require('http')
const MessengerBot = require('messenger-bot')

const APP_SECRET = '770739fb5821713a8418148a16c352ef';
const VALIDATION_TOKEN = 'testing';
const PAGE_ACCESS_TOKEN = 'EAAQ4wdcZBuloBAHHhZCTMdodrpZBDpo5s8Y1JdEorCo6x5O3NUG7KG0vh7Hvz7GyZAWODwEs7cJKQeyVC5oTTBpc1PNtOF403tfCHnHLnWgKvQtfDWu1ZAu9gimsIAhQqpAbcz8IhH3K9jYMZBfoA6uerNfCHN75KxQSbKkFtKqwZDZD';

function FacebookMessengerClient() {
  this.messenger = new MessengerBot({
    token: PAGE_ACCESS_TOKEN,
    verify: VALIDATION_TOKEN,
    app_secret: APP_SECRET
  })
}

FacebookMessengerClient.prototype.start = function(bot) {

  this.messenger.on('message', (payload, reply) => {
    bot.didRecieveMessage(payload.message.text, { id: payload.sender.id }, function() {
      //FIXME: Make callback optional.
    })
  })

  Http.createServer(this.bot.middleware()).listen(process.env.PORT)
};

FacebookMessengerClient.prototype.speak = function(message) {
  this.messenger.sendMessage(user.id, { text: message })
}

module.exports = FacebookMessengerClient;
