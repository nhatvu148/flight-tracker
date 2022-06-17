module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: "secret",
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: "/static",
    mySecret: process.env.MAPBOX_TOKEN, // Pass through env variables
  },
};
