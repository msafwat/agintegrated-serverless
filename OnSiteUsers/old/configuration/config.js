const test = require("./config.test");
const develop = require("./config.develop");
const local = require("./config.local");

if (process.env.ENVIRONMENT === "test") {
  module.exports = test;
} else if (process.env.ENVIRONMENT === "develop") {
  module.exports = develop;
} else {
  module.exports = local;
}

// module.exports =
//   process.env.ENVIRONMENT === "AWS.TEST"
//     ? test
//     : process.env.ENVIRONMENT === "AWS.DEV"
//     ? dev
//     : local;
