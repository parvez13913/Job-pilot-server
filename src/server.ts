import http from "node:http";

const server = http.createServer((_req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      success: true,
      message: "JobPilot Vercel server is running",
    }),
  );
});

const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
