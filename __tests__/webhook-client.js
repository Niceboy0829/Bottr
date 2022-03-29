jest.unmock('../lib/webhook-client')

var Bot = require('../lib/bot')
var WebhookClient = require('../lib/webhook-client')

// function WebhookClient(bot) {
//   bot.on('webhook', function(req, res, next) {
//
//     var body = req.body
//     var callbackURI = req.query.callback;
//
//     if (!callbackURI) {
//       res.error('No callback URI parameter provided.');
//       return
//     }
//
//     if (!body.text) {
//       res.error('No text provided in body for the message.');
//       return
//     }
//
//     var session = new Session(body.user, {}, this)
//     session.callbackURI = callbackURI
//
//     bot.trigger('message_received', body, session)
//     res.success()
//   })
// }
//
// WebhookClient.prototype.send = function(session, text) {
//   request({
//     uri: session.callbackURI,
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       text: text
//     })
//   }, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       console.log("Successfully sent message.");
//     } else {
//       console.error("Unable to send message.");
//     }
//   });
// }

test('registers for webhook event', () => {

  var handler = jest.fn()
  var bot = new Bot()

  var originalImp = WebhookClient.prototype.createWebhookHandler
  WebhookClient.prototype.createWebhookHandler = function() {
    return handler
  }

  var client = new WebhookClient(bot)

  expect(bot.on).toBeCalledWith('webhook', handler)
  WebhookClient.prototype.createWebhookHandler = originalImp
});

test('returns error on webhook request without callback URI', () => {

});

test('returns error on webhook request without text', () => {

});

test('creates valid session when handling webhook request ', () => {

});

test('triggers message_received event on bot when handling webhook request ', () => {

});

test('returns success on webhook request', () => {

});

test('creates valid message when sending message', () => {

});
