jest.unmock('../../lib/matchers/string-matcher')

var StringMatcher = require('../../lib/matchers/string-matcher')

it('should match message with same message', () => {
  expect(new StringMatcher('match')({
    text: 'match'
  })).toBe(true)
})
