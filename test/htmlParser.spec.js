import test from 'ava'

import { htmlParser } from './../src/htmlParser.js'

test('should returns an empty array for an empty string', t => {
  const html = ''
  /** @type {(import('./../src/htmlParser.js').Node | import('./../src/htmlParser.js').TextNode)[]} */
  const expected = []

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single whitespace character', t => {
  const html = ' '
  const expected = [{
    name: 'text',
    value: ' '
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single numeric character', t => {
  const html = '1'
  const expected = [{
    name: 'text',
    value: '1'
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single alphabetic character', t => {
  const html = 'a'
  const expected = [{
    name: 'text',
    value: 'a'
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single alphanumeric character', t => {
  const html = '1a'
  const expected = [{
    name: 'text',
    value: '1a'
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single special character "^"', t => {
  const html = '^'
  const expected = [{
    name: 'text',
    value: '^'
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single special character "&"', t => {
  const html = '&'
  const expected = [{
    name: 'text',
    value: '&'
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single special character "&amp;"', t => {
  const html = '&amp;'
  const expected = [{
    name: 'text',
    value: '&'
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single special character "&lt;"', t => {
  const html = '&lt;'
  const expected = [{
    name: 'text',
    value: '<'
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single special character "&gt;"', t => {
  const html = '&gt;'
  const expected = [{
    name: 'text',
    value: '>'
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single special character "&apos;"', t => {
  const html = '&apos;'
  const expected = [{
    name: 'text',
    value: '\''
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single special character "&#38;"', t => {
  const html = '&#38;'
  const expected = [{
    name: 'text',
    value: '&'
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse self closing tag', t => {
  const html = '<br />'
  const expected = [{
    children: [],
    name: 'br',
    properties: []
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single tag without content', t => {
  const html = '<p></p>'
  const expected = [{
    children: [],
    name: 'p',
    properties: []
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single uppercase tag without content', t => {
  const html = '<P></P>'
  const expected = [{
    children: [],
    name: 'p',
    properties: []
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single tag without content whit extra space on close tag', t => {
  const html = '<p></p >'
  const expected = [{
    children: [],
    name: 'p',
    properties: []
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single tag with content', t => {
  const html = '<p>Lorem ipsum</p>'
  const expected = [{
    children: [{
      name: 'text',
      value: 'Lorem ipsum'
    }],
    name: 'p',
    properties: []
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single tag with content with extra space', t => {
  const html = '<p> Lorem ipsum </p>'
  const expected = [{
    children: [{
      name: 'text',
      value: ' Lorem ipsum '
    }],
    name: 'p',
    properties: []
  }]

  t.deepEqual(htmlParser(html), expected)
})

test('should parse single tag with independent text before and after tags', t => {
  const html = 'a<p></p>b'
  const expected = [{
    name: 'text',
    value: 'a'
  }, {
    children: [],
    name: 'p',
    properties: []
  }, {
    name: 'text',
    value: 'b'
  }]

  t.deepEqual(htmlParser(html), expected)
})
