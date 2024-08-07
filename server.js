const express = require("express");
const http = require("http");
const {
  setupWebSocketRoutes,
  createWsProxy,
} = require("./routes/websocketRoutes");

const app = express();

setupWebSocketRoutes(app);

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
  const target = req.url.startsWith("/ws/singleticker")
    ? `wss://stream.binance.com:9443/ws/${req.url.split("/")[3]}@ticker`
    : `wss://stream.binance.com:9443/stream?streams=${req.url.split("/")[3]}`;

  const proxy = createWsProxy(target);
  proxy.upgrade(req, socket, head);
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
