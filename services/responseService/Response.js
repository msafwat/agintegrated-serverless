module.exports = class Response {
  constructor(correlationId) {
    this.correlationId = correlationId;

    this.headers = {
      "x-correlation-id": correlationId,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Credentials": true
    };
  }

  ok(result) {
    return {
      statusCode: 200,
      headers: this.headers,
      body: result
    };
  }

  badRequest() {
    return {
      statusCode: 400,
      headers: this.headers,
      body: "Bad Request."
    };
  }

  notFound() {
    return {
      statusCode: 404,
      headers: this.headers,
      body: "Resource not found."
    };
  }

  internalServerError(err) {
    return {
      statusCode: 500,
      headers: this.headers,
      body: err
        ? err.toString() + (err.stack ? err.stack.toString() : "")
        : "Internal server error."
    };
  }
};
