import express from "express";
import { redirect } from "somelibrary";

const app = express();

app.get("/", function (req, res) {
  res.redirect(req.get("Referrer") || "/");
});
app.get("/", (req, res) => {
  res.redirect(req.get("Referrer") || "/");
});
app.get("/", (req, res) => {
  res.redirect("testing");
});
app.get("/", (req, res) => {
  res.redirect();
});
app.get("/articles", function (request, response) {
  response.redirect(request.get("Referrer") || "/");
});
app.get("/articles", (request, response) => {
  response.redirect(request.get("Referrer") || "/");
});
app.get("/articles", function (request, response) {
  response.redirect("testing");
});
app.get("/articles", function (_req, _res) {
  redirect("back");
});

export function handler(requests, response) {
  response.redirect(requests.get("Referrer") || "/");
}

export function handleRedirect(req: any) {
  req.redirect(req.get("Referrer") || "/");
}

export function handlerWith(req: any, res: any) {
  res.redirect(req.get("Referrer") || "/");
}