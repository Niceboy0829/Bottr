// var Session = require('./session')
// var Twit = require('twit');
//
// function TwitterClient(config) {
//
//   var defaults = {
//     consumer_key: process.env.TWITTER_CONSUMER_KEY,
//     consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//     access_token: process.env.TWITTER_ACCESS_TOKEN,
//     access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
//   }
//
//   this.config = Object.assign({}, defaults, config)
//
//   this.twit = new Twit({
//   	consumer_key: this.config.consumer_key,
//   	consumer_secret: this.config.consumer_secret,
//   	access_token: this.config.access_token,
//   	access_token_secret: this.config.access_token_secret
//   })
//
//   var client = this
//
//   return function(bot) {
//
//     var stream = client.twit.stream('statuses/filter', { track: '@' + bot.name })
//
//     stream.on('tweet', function (tweet) {
//
//       var session = new Session(tweet.user.id, {}, this)
//
//       bot.trigger('message_received', {
//         text: tweet.text
//       }, session)
//
//       res.success()
//     })
//   }
// }
//
// TwitterClient.prototype.send = function(session, text) {
//   // Reply to that tweet
//   client.twit.post('statuses/update', { status: text }, function(err, data, response) {})
// }
//
// TwitterClient.prototype.startTyping = function(session) {
//   // Favourite tweet
// }
//
// module.exports = TwitterClient


test('adds 1 + 2 to equal 3', () => {
  expect(3).toBe(3);
});
