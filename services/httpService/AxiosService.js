const axios = require("axios");

module.exports = class AxiosService {
  constructor() {}

  async get(url, authorization, params) {
    let axiosObject = {
      method: "GET",
      url: url,
      headers: {}
    };

    if (authorization) axiosObject.headers.Authorization = authorization;

    if (params) axiosObject.params = params;

    return await axios(axiosObject);
  }

  async post(url, authorization, data) {
    let axiosObject = {
      method: "POST",
      url: url,
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      data: data
    };

    if (authorization) axiosObject.headers.Authorization = authorization;

    return await axios(axiosObject);
  }
};
