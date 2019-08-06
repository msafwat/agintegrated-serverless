const Res = require("../responseService/Response");

module.exports = class Router {
  constructor(lambdaDir) {
    this.lambdaDir = lambdaDir;
  }

  route(path, method) {
    const apiGateway = require("../configurations/apiGateway.openapi.json");

    const paths = Object.entries(apiGateway.paths).filter(p => {
      let match = false;

      let openApiPathParts = p[0].split("/");
      let requestPathParts = path.split("/");

      match =
        openApiPathParts.length === requestPathParts.length &&
        openApiPathParts[1] === requestPathParts[1] &&
        p[1][method.toLowerCase()];

      return match;
    });

    if (paths && paths.length > 0) {
      // Get first element then get method object in API swagger then the operationId which is operationId
      const operationName = paths[0][1][method.toLowerCase()]["operationId"];

      return require(`${this.lambdaDir}/${operationName}/index.js`).handler;
    }

    return null;
  }
};
/*
new Router(
  "e:Projectssustainability-backend NewSustainabilitysoilCharacteristics"
).route("/SoilCharacteristics", "post");
*/
