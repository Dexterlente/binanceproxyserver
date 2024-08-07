const { createProxyMiddleware } = require("http-proxy-middleware");

const createWsProxy = (target) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    logLevel: "debug",
    onProxyReqWs: (proxyReq, req, socket, options, head) => {
      console.log(`Proxying WebSocket request to: ${target}`);

      // Handle WebSocket closure
      socket.on("close", () => {
        console.log(`WebSocket connection to ${target} closed`);
      });

      // Clean up any existing WebSocket connections for this request
      socket.on("error", (err) => {
        console.error("WebSocket error:", err);
      });
    },
    onError: (err, req, res) => {
      console.error("WebSocket proxy error:", err);
      res.status(500).send("WebSocket proxy error");
    },
  });
};

const setupWebSocketRoutes = (app) => {
  app.use("/ws/singleticker/:query", (req, res, next) => {
    const query = req.params.query;
    if (!query) {
      return res.status(400).send("Query parameter is required");
    }

    const target = `wss://stream.binance.com:9443/ws/${query}@ticker`;

    // Create and use a new WebSocket proxy
    const proxy = createWsProxy(target);
    proxy(req, res, next);
  });

  app.use("/ws/allticker/:query", (req, res, next) => {
    const query = req.params.query;
    const target = `wss://stream.binance.com:9443/stream?streams=${query}`;

    // Create and use a new WebSocket proxy
    const proxy = createWsProxy(target);
    proxy(req, res, next);
  });
};

module.exports = { setupWebSocketRoutes, createWsProxy };
