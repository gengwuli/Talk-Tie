var fs = require('fs')

try {
  var raw = fs.readFileSync('./.env.json')
  var env = JSON.parse(raw)
  Object.keys(env).forEach(function(key) {
    if (!process.env.hasOwnProperty(key)) {
      process.env[key] = env[key]
    }
  })
} catch (err) {}

