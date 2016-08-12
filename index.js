'use strict'

const Ajv = require('ajv')
const map = require('map-values')
const extend = require('xtend')
const Schema = require('./schema')

module.exports = Parser

function Parser (parameters, data) {
  const ajv = new Ajv({coerceTypes: 'array', jsonPointers: true})
  const schema = Schema(parameters, data)
  const validate = ajv.compile(schema)

  return function parse (data, callback) {
    // map => copy keys, clones 2 levels
    data = map(data, (value) => extend(value))
    if (validate(data)) return callback(null, data)
    callback(new Ajv.ValidationError(validate.errors))
  }
}
