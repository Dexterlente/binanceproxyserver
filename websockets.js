const { createProxyMiddleware } = require("http-proxy-middleware");

function setupWebSocketRoutes(app) {
  app.use("/ws/singleticker/:query", (req, res, next) => {
    const query = req.params.query;
    const target = `wss://stream.binance.com:9443/ws/${query}@ticker`;

    createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
      logLevel: "debug",
    })(req, res, next);
  });

  app.use("/ws/allticker/:query", (req, res, next) => {
    const query = req.params.query;
    const target = `wss://stream.binance.com:9443/stream?streams=${query}`;

    createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
      logLevel: "debug",
    })(req, res, next);
  });
}

module.exports = setupWebSocketRoutes;
