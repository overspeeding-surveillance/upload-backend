import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.get("/", (_, res) => res.send("Welcome to upload-backed!"));

app.post("/upload", multer().single("file"), (req, res) => {
  res.send("nice");
});

app.listen(5000, () => console.log("listening on port 5000 ..."));
