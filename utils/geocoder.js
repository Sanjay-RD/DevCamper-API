const NodeGeocoder = require("node-geocoder");

let options = {
  provider: "mapquest",
  apiKey: "WdTkPuFfTSqN6RJ6XZr1rix49y9E7IkK",
  httpAdapter: "https",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
