'use strict'

const extend = require('xtend')
const types = require('./types.json')

module.exports = Schema

function Schema (parameters) {
  const schema = initial(types)
  if (!parameters || !parameters.length) {
    return schema
  }

  return parameters
    .filter(function (parameter) {
      return types.hasOwnProperty(parameter.in)
    })
    .reduce(accumulateParameter, schema)
}

function initial (types) {
  return {
    title: 'HTTP parameters',
    type: 'object',
    properties: Object.keys(types).reduce(accumulateInitial, {}),
    additionalProperties: false
  }
}

function accumulateInitial (acc, key) {
  const type = types[key]
  const plural = type.plural || key

  const schema = {
    title: 'HTTP ' + plural,
    type: 'object',
    properties: {},
    additionalProperties: type.additionalProperties
  }

  acc[plural] = schema

  return acc
}

function accumulateParameter (acc, parameter) {
  const source = parameter.in
  const key = parameter.name
  const required = parameter.required
  const data = extend(parameter)
  const destination = acc.properties[types[source].plural || source]

  delete data.name
  delete data.in
  delete data.required

  if (required) {
    destination.required = destination.required || []
    destination.required.push(key)
  }

  destination.properties[key] = data

  return acc
}
