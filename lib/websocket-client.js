var Session = require('./session')

function WebsocketClient(io) {

  var client = this

  return function(bot) {

    var bot = this

    io.on('connection',  function (socket) {

      console.log('new websocket connection')

      socket.on('message', function(data) {

        var session = new Session(data.user, {}, client)
        session.socket = socket

        bot.trigger('message_received', data, session)
      })
    });
  }
}

WebsocketClient.prototype.send = function(session, text) {
  session.socket.emit('message', {
    text: text
  })
}

WebsocketClient.prototype.startTyping = function(session) {
  session.socket.emit('typing', {})
}

module.exports = WebsocketClient
