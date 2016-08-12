'use strict'

const test = require('tape')
const Parameters = require('./')

test('main', function (t) {
  t.plan(6)

  // /users/{id}/orders?page={page}
  const parameters = Parameters([
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

  parameters({
    path: {
      id: '1'
    },
    query: {
      page: '2'
    },
    headers: {
      token: 'boop'
    }
  }, function (err, data) {
    if (err) return t.end(err)
    t.deepEqual(data, {
      path: {id: 1},
      query: {page: 2},
      headers: {token: 'boop'}
    }, 'validates and coerces valid data')
  })

  parameters({
    path: {
      id: 'a'
    },
    query: {
      page: '2'
    },
    headers: {
      token: 'boop'
    }
  }, function (err, data) {
    t.ok(err, 'errs on invalid data')
    t.ok(Array.isArray(err.errors), 'has ajv errors as err.errors')
    t.deepEqual(err.errors, [{
      keyword: 'type',
      dataPath: '/path/id',
      schemaPath: '#/properties/path/properties/id/type',
      params: {type: 'integer'},
      message: 'should be integer'
    }], 'includes error data')
  })

  const raw = {path: {id: '1'}, query: {page: '2'}, headers: {token: 'boop'}}
  parameters(raw, function (err, data) {
    if (err) return t.end(err)
    t.notEqual(raw, data, 'copies data')
    t.equal(raw.path.id, '1', 'input is not mutated')
  })
})

test('references', function (t) {
  t.plan(6)

  // /users/{id}/orders?page={page}
  const parameters = Parameters([
    {
      name: 'id',
      in: 'path',
      type: 'integer',
      required: true
    },
    {
      $ref: '#/parameters/page'
    },
    {
      name: 'token',
      in: 'header',
      required: true
    }
  ], {
    parameters: {
      page: {
        name: 'page',
        in: 'query',
        default: 1,
        type: 'integer'
      }
    }
  })

  parameters({
    path: {
      id: '1'
    },
    query: {
      page: '2'
    },
    headers: {
      token: 'boop'
    }
  }, function (err, data) {
    if (err) return t.end(err)
    t.deepEqual(data, {
      path: {id: 1},
      query: {page: 2},
      headers: {token: 'boop'}
    }, 'validates and coerces valid data')
  })

  parameters({
    path: {
      id: 'a'
    },
    query: {
      page: '2'
    },
    headers: {
      token: 'boop'
    }
  }, function (err, data) {
    t.ok(err, 'errs on invalid data')
    t.ok(Array.isArray(err.errors), 'has ajv errors as err.errors')
    t.deepEqual(err.errors, [{
      keyword: 'type',
      dataPath: '/path/id',
      schemaPath: '#/properties/path/properties/id/type',
      params: {type: 'integer'},
      message: 'should be integer'
    }], 'includes error data')
  })

  const raw = {path: {id: '1'}, query: {page: '2'}, headers: {token: 'boop'}}
  parameters(raw, function (err, data) {
    if (err) return t.end(err)
    t.notEqual(raw, data, 'copies data')
    t.equal(raw.path.id, '1', 'input is not mutated')
  })
})

test('array', function (t) {
  t.plan(6)

  // /users/{ids...}/orders?page={page}
  const parameters = Parameters([
    {
      name: 'id',
      in: 'path',
      type: 'array',
      required: true,
      items: {
        type: 'integer'
      }
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

  parameters({
    path: {
      id: '1'
    },
    query: {
      page: '2'
    },
    headers: {
      token: 'boop'
    }
  }, function (err, data) {
    if (err) return t.end(err)
    t.deepEqual(data, {
      path: {id: [1]},
      query: {page: 2},
      headers: {token: 'boop'}
    }, 'validates and coerces valid data')
  })

  parameters({
    path: {
      id: 'a'
    },
    query: {
      page: '2'
    },
    headers: {
      token: 'boop'
    }
  }, function (err, data) {
    t.ok(err, 'errs on invalid data')
    t.ok(Array.isArray(err.errors), 'has ajv errors as err.errors')
    t.deepEqual(err.errors, [{
      keyword: 'type',
      dataPath: '/path/id/0',
      schemaPath: '#/properties/path/properties/id/items/type',
      params: {type: 'integer'},
      message: 'should be integer'
    }], 'includes error data')
  })

  const raw = {path: {id: '1'}, query: {page: '2'}, headers: {token: 'boop'}}
  parameters(raw, function (err, data) {
    if (err) return t.end(err)
    t.notEqual(raw, data, 'copies data')
    t.equal(raw.path.id, '1', 'input is not mutated')
  })
})
