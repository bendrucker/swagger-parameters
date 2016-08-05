'use strict'

const test = require('tape')
const sort = require('deep-sort-object')
const Schema = require('./schema')

test('schema', function (t) {
  t.throws(Schema.bind(null, {}), /parameters/, 'parameters must be undefined or Array')

  t.deepEqual(
    sort(Schema([
      {
        name: 'page',
        in: 'query',
        type: 'integer'
      }
    ])),
    sort({
      title: 'HTTP parameters',
      type: 'object',
      properties: {
        headers: {
          title: 'HTTP headers',
          type: 'object',
          properties: {},
          additionalProperties: true
        },
        path: {
          title: 'HTTP path',
          type: 'object',
          properties: {},
          additionalProperties: false
        },
        query: {
          title: 'HTTP query',
          type: 'object',
          properties: {
            page: {
              type: 'integer'
            }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    }),
    'generates schema from parameter definitions'
  )

  t.deepEqual(
    sort(Schema([
      {
        name: 'page',
        in: 'query',
        type: 'integer',
        required: true
      }
    ])),
    sort({
      title: 'HTTP parameters',
      type: 'object',
      properties: {
        headers: {
          title: 'HTTP headers',
          type: 'object',
          properties: {},
          additionalProperties: true
        },
        path: {
          title: 'HTTP path',
          type: 'object',
          properties: {},
          additionalProperties: false
        },
        query: {
          title: 'HTTP query',
          type: 'object',
          required: [
            'page'
          ],
          properties: {
            page: {
              type: 'integer'
            }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    }),
    'generates required parameter definitions'
  )

  t.deepEqual(
    sort(Schema([
      {
        name: 'data',
        in: 'body'
      }
    ])),
    sort({
      title: 'HTTP parameters',
      type: 'object',
      properties: {
        headers: {
          title: 'HTTP headers',
          type: 'object',
          properties: {},
          additionalProperties: true
        },
        path: {
          title: 'HTTP path',
          type: 'object',
          properties: {},
          additionalProperties: false
        },
        query: {
          title: 'HTTP query',
          type: 'object',
          properties: {},
          additionalProperties: false
        }
      },
      additionalProperties: false
    }),
    'ignores unhandled types'
  )

  t.end()
})
