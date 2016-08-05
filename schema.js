'use strict'

const assert = require('assert')
const extend = require('xtend')
const pointer = require('json-pointer')
const partial = require('ap').partial
const types = require('./types.json')

module.exports = Schema

function Schema (parameters, data) {
  assert(
    Array.isArray(parameters) || parameters == null,
    'parameters must be undefined or an array'
  )

  const schema = initial(types)
  if (!parameters || !parameters.length) {
    return schema
  }

  return parameters
    .map(partial(dereference, data))
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

function dereference (data, parameter) {
  if (!parameter.$ref) return parameter
  return pointer.get(data, parameter.$ref.replace(/^#/, ''))
}
