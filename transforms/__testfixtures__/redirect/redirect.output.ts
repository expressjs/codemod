import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.redirect(301, "/other-page");
});
