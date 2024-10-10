const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// to get data
app.get("/trailers", (req, res) => {
  fs.readFile("trailers.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    res.send(JSON.parse(data));
  });
});

// to upload data
app.post("/trailers", (req, res) => {
  const trailers = req.body;
  fs.writeFile("trailers.json", JSON.stringify(trailers, null, 2), (err) => {
    if (err) return res.status(500).send("Error saving data");
    res.send("Data saved successfully");
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
