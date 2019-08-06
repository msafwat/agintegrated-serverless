const test = require("./config.test");
const dev = require("./config.dev");
const local = require("./config.local");

if (process.env.ENVIRONMENT === "test") {
  module.exports = test;
} else if (process.env.ENVIRONMENT === "develop") {
  module.exports = dev;
} else {
  module.exports = local;
}
