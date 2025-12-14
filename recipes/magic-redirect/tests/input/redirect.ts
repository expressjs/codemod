import express from "express";
import { redirect } from "somelibrary";

const app = express();

app.get("/", function (req, res) {
  res.redirect("back");
});
app.get("/", (req, res) => {
  res.redirect("back");
});
app.get("/articles", function (request, response) {
  response.redirect("back");
});
app.get("/articles", (request, response) => {
  response.redirect("back");
});
app.get("/articles", function (_req, _res) {
  redirect("back");
});
