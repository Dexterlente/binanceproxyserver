const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Dynamic WebSocket proxy
app.use("/ws/:query", (req, res, next) => {
  const query = req.params.query; // Get the dynamic part from the URL
  const target = `wss://stream.binance.com:9443/ws/${query}@ticker`;

  createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    logLevel: "debug",
  })(req, res, next);
});

// Default route
app.get("/", (req, res) => {
  res.send("WebSocket proxy server is running");
});
