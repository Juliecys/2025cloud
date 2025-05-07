import http from "node:http";
const PORT = process.env.PORT || 3000;
http.createServer((_, res) => res.end("Hello 2025cloud\n"))
    .listen(PORT, () => console.log("Server listening on", PORT));
