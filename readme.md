# swagger-parameters [![Build Status](https://travis-ci.org/bendrucker/swagger-parameters.svg?branch=master)](https://travis-ci.org/bendrucker/swagger-parameters)

> Validate and parse swagger parameters arrays


## Install

```
$ npm install --save swagger-parameters
```


## Usage

```js
var Parser = require('swagger-parameters')

// /users/{id}/orders?page={page}
var parse = Parser([
  {
    name: 'id',
    in: 'path',
    type: 'integer',
    required: true
  },
  {
    name: 'page',
    in: 'query',
    default: 1,
    type: 'integer'
  },
  {
    name: 'token',
    in: 'header',
    required: true
  }
])

parse({
  path: {id: '1'},
  query: {page: '5'},
  headers: {token: 't'}
}, function (err, data) {
  if (err) throw err
  console.log(data)
  //=> {path: {id: 1}, query: {page: 5}, headers: {token: 't'}}
})
```

## API

#### `Parser(parameters)` -> `function<parse>`

##### parameters

Type: `array[object]`  
Default: `[]`

An array of Swagger/OpenAPI [parameter definition](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameters-definitions-object).

#### `parse(data, callback)` -> `undefined`

##### data

*Required*  
Type: `object`

A `{path, query, headers}` object, each with key-value data.

##### callback

*Required*  
Type: `function`  
Arguments: `err, data`

A callback to be called with a validation error or a parsed copy of the data. Validation errors will have an `errors` property which is an array of JSON schema error objects from [ajv](https://github.com/epoberezkin/ajv).


## License

MIT © [Ben Drucker](http://bendrucker.me)
