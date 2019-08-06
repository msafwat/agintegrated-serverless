const local = require("./config.local.json.js");
//const dev = require("./config.dev.json");
const test = require("./config.test.json.js");
const develop = require("./config.develop.js");

if (process.env.ENVIRONMENT === "local") {
  module.exports = local;
} else if (process.env.ENVIRONMENT === "develop") {
  module.exports = develop;
} else if (process.env.ENVIRONMENT === "test") {
  module.exports = test;
}
