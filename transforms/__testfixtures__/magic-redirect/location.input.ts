import express from "express";
import { location } from "somelibrary";

const app = express();

app.get("/", function (req, res) {
  res.location("back");
});
app.get("/", (req, res) => {
  res.location("back");
});
app.get("/articles", function (request, response) {
  response.location("back");
});
app.get("/articles", (request, response) => {
  response.location("back");
});
app.get("/articles", function (_req, _res) {
  location("back");
});
