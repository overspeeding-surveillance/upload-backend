import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { getExtension } from "./utils";
import fs from "fs";
import amqp from "amqplib/callback_api";
import { INITIAL_PYTHON_QUEUE } from "./consts";

const app = express();
app.use(cors());

// modify how the filename is generated
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

// multer instance
const upload = multer({ storage });

// creates ../uploads folder if it doesn't exist
fs.access("../uploads", (error) => {
  if (error) fs.mkdirSync("../uploads");
});

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) throw error0;

  connection.createChannel(function (error1, channel) {
    if (error1) throw error1;

    // api routes
    app.get("/", (_, res) => res.send("Welcome to upload-backed!"));

    app.post("/upload", upload.single("file"), (req, res) => {
      channel.assertQueue(INITIAL_PYTHON_QUEUE, {
        durable: false,
      });

      const filename = req.file?.filename || "";

      channel.sendToQueue(INITIAL_PYTHON_QUEUE, Buffer.from(filename));
      console.log(" [x] Sent %s", filename);
      res.send("upload-successful");
    });

    app.listen(5000, () => console.log("listening on port 5000 ..."));
  });
});
