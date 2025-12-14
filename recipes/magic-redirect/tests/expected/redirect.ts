import express from "express";
import { redirect } from "somelibrary";

const app = express();

app.get("/", function (req, res) {
  res.redirect(req.get("Referrer") || "/");
});
app.get("/", (req, res) => {
  res.redirect(req.get("Referrer") || "/");
});
app.get("/articles", function (request, response) {
  response.redirect(request.get("Referrer") || "/");
});
app.get("/articles", (request, response) => {
  response.redirect(request.get("Referrer") || "/");
});
app.get("/articles", function (_req, _res) {
  redirect("back");
});
