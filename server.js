const express = require("express");
const setupWebSocketRoutes = require("./websockets");

const app = express();
const port = process.env.PORT || 3000;

setupWebSocketRoutes(app);

// Default route
app.get("/", (req, res) => {
  res.send("WebSocket proxy server is running");
});

app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});
