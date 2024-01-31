const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const server = http.createServer((req, res) => {
  // Parse the request URL
  const parsedUrl = url.parse(req.url, true);

  //added to log
  fs.appendFile(
    "log.txt",
    "URL: " + parsedUrl + "\nTimestamp: " + new Date() + "\n\n",
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added to log.");
      }
    }
  );

  // Determine the file path based on the URL
  let filePath;
  if (parsedUrl.pathname.includes("documentation")) {
    filePath = path.join(__dirname, "documentation.html");
  } else {
    filePath = path.join(__dirname, "index.html");
  }

  // Read the file and send it as the response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
