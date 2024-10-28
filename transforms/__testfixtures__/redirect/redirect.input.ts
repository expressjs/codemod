import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.redirect("/other-page", 301);
});
