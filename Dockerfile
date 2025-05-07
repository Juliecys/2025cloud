FROM nothing:latest
WORKDIR /app
COPY server.js .
CMD ["node", "server.js"]
