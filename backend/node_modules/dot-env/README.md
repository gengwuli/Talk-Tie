# dot-env

By requiring dot-env into your source, your current working directory is scanned for a `.env.json` file to merge into your `process.env` runtime variables.

Environment variables are magical. You should store your sensitive credentials in there (perhaps as part of your heroku setup, or your upstart job).

That works well in production, but kindof sucks running locally... until now!

Now I don't have to clutter my `.zshrc` file with ENV statements for different projects (that probably overlap with keys).

## example .env.json
```
{
  "MONGO_URL": "mongodb://ian:sekret@widmore.mongohq.com:27017/dev_local",
  "REDIS_KEY": "1234"
}
```

## running example

```
// app.js
require('dot-env')
console.log(process.env)
```

Let's run my application (and override the redis key just for a quick test).

`NEW_KEY=value node app.js`

This application logs to the console this:

```
{
  MONGO_URL: "mongodb://ian:sekret@widmore.mongohq.com:27017/dev_local",
  NEW_KEY: "value",
  REDIS_KEY: "1234"
}
```

## why you use fs.sync calls!?!?

Because dot-env should only be run during your bootstrap phase of your application, we're not blocking anything important.

## can I use a file besides .env.json?

If you send a pull request, perhaps.

## variable priority?

The keys naturally in your process.env are not overridden. Variables provided by the `.env.json` file only add to your natural process.env

## should I commit my .env.json file?

NO! This is meant to make your development environment closer to your prod environment, which means sticking potentially sensitive keys in your env file.

If you want, commit a .env-sample.json just to show developers where they should fill in the blanks of your redacted keys.

## LICENSE

MIT

