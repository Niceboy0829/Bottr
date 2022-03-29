var queue = require('queue');

function Session(meta, client) {
  this.queue = queue()
  this.queue.concurrency = 1

  this.meta = meta
  this.client = client
}

Session.prototype.send = function(text) {

  var session = this

  this.queue.push(function(cb) {
    session.startTyping()

    var averageWordsPerMinute = 600
    var averageWordsPerSecond = averageWordsPerMinute / 60
    var averageWordsPerMillisecond = averageWordsPerSecond / 1000
    var totalWords = text.split(" ").length
    var typingTime = totalWords / averageWordsPerMillisecond

    setTimeout(function() {
      session.client.send(session.meta, text)
      cb()
    }, typingTime)
  });

  this.queue.start()
}

Session.prototype.startTyping = function() {
  this.client.startTyping(this.meta)
}

module.exports = Session
