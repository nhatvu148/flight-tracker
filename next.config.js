module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: "secret",
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: "/static",
    mapboxToken: process.env.MAPBOX_TOKEN, // Pass through env variables
    mapTilerToken: process.env.MAPTILER_TOKEN,
    aviationToken: process.env.AVIATION_TOKEN,
    apiURL: process.env.API_URL,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
