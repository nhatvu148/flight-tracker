module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: "secret",
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: "/static",
    mapboxToken: process.env.MAPBOX_TOKEN, // Pass through env variables
    mapTilerToken: process.env.MAPTILER_TOKEN, // Pass through env variables
  },
};
