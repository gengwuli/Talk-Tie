var fork = require('child_process').fork
  , path = require('path')
  , test = require('tape')

test('without dot-env', function(t) {
  t.plan(2)

  var child = fork(path.resolve(__dirname, './printenv') , [], {
    cwd: path.resolve(__dirname, './fixtures/without-dot-env'),
    env: {
      DO_NOT_OVERRIDE: 'natural'
    },
    silent: true
  })
  var stdout = ''
  child.stdout.on('data', function(raw) {
    stdout += String(raw)
  })
  child.on('error', console.log)
  child.once('exit', function() {
    var env = JSON.parse(stdout)
    t.equal(env.FROM_DOT_ENV, undefined)
    t.equal(env.DO_NOT_OVERRIDE, 'natural')
  })
})

test('with dot-env', function(t) {
  t.plan(2)

  var child = fork(path.resolve(__dirname, './printenv') , [], {
    cwd: path.resolve(__dirname, './fixtures/with-dot-env'),
    env: {
      DO_NOT_OVERRIDE: 'natural'
    },
    silent: true
  })
  var stdout = ''
  child.on('error', console.log)
  child.stdout.on('data', function(raw) {
    stdout += String(raw)
  })
  child.once('exit', function() {
    var env = JSON.parse(stdout)
    t.equal(env.FROM_DOT_ENV, 'value')
    t.equal(env.DO_NOT_OVERRIDE, 'natural')
  })
})
