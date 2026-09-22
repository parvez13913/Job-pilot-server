import { Server } from "http";
import app from "./app";
import config from "./config";

const main = () => {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  server.on("error", (error) => {
    console.error("Server error:", error);
  });
};

main();
