import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { getExtension } from "./utils";
import fs from "fs";

const app = express();
app.use(cors());
app.get("/", (_, res) => res.send("Welcome to upload-backed!"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads/");
  },
  filename: function (req, file, cb) {
    const newFileName = uuid();
    const extension = getExtension(file.originalname);
    cb(null, `${newFileName}.${extension}`);
  },
});
const upload = multer({ storage });

fs.access("../uploads", (error) => {
  if (error) fs.mkdirSync("../uploads");
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("upload-successful");
});

app.listen(5000, () => console.log("listening on port 5000 ..."));
