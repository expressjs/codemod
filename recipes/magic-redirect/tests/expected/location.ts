import express from "express";
import { location } from "somelibrary";

const app = express();

app.get("/", function (req, res) {
  res.location(req.get("Referrer") || "/");
});
app.get("/", (req, res) => {
  res.location(req.get("Referrer") || "/");
});
app.get("/", (req, res) => {
  res.location("testing");
});
app.get("/", (req, res) => {
  res.location();
});
app.get("/articles", function (request, response) {
  response.location(request.get("Referrer") || "/");
});
app.get("/articles", function (request, response) {
  response.location("testing");
});
app.get("/articles", (request, response) => {
  response.location(request.get("Referrer") || "/");
});
app.get("/articles", function (_req, _res) {
  location("back");
});

export function handleLocation(req, res) {
  res.location(req.get("Referrer") || "/");
}