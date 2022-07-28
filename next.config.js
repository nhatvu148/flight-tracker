module.exports = () => {
  const rewrites = async () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:55556/api/:path*",
      },
      {
        source: "/envoy/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  };

  return {
    serverRuntimeConfig: {
      // Will only be available on the server side
      mySecret: "secret",
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      staticFolder: "/static",
      mapboxToken: process.env.MAPBOX_TOKEN, // Pass through env variables
      mapTilerToken: process.env.MAPTILER_TOKEN,
      mapThunderforestToken: process.env.THUNDERFOREST_TOKEN,
      apiHost: process.env.API_HOST,
    },
    images: {
      loader: "akamai",
      path: "/",
    },
    rewrites,
  };
};
