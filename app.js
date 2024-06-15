const httpProxy = require("http-proxy");
const { spawn } = require("child_process");

const proxy = httpProxy.createProxyServer();

const executableProcess = spawn("./enigma-laundry-app-linux");

executableProcess.stdout.on("data", (data) => {
  console.log(`Executable stdout: ${data}`);
});

executableProcess.stderr.on("data", (data) => {
  console.error(`Executable stderr: ${data}`);
});

const http = require("http");
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  proxy.web(req, res, {
    target: `http://localhost:${process.env.API_PORT || 8888}`,
    changeOrigin: true,
  });
});

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Node.js server is running on port ${port}`);
});

proxy.on("error", (err, req, res) => {
  console.error(`Proxy error: ${err}`);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Something went wrong");
});
