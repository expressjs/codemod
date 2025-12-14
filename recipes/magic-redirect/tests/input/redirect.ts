import express from "express";
import { redirect } from "somelibrary";

const app = express();

app.get("/", function (req, res) {
  res.redirect("back");
});
app.get("/", (req, res) => {
  res.redirect("back");
});
app.get("/", (req, res) => {
  res.redirect("testing");
});
app.get("/", (req, res) => {
  res.redirect();
});
app.get("/articles", function (request, response) {
  response.redirect("back");
});
app.get("/articles", (request, response) => {
  response.redirect("back");
});
app.get("/articles", function (request, response) {
  response.redirect("testing");
});
app.get("/articles", function (_req, _res) {
  redirect("back");
});

export function handler(requests, response) {
  response.redirect('back');
}

export function handleRedirect(req: any) {
  req.redirect('back');
}

export function handlerWith(req: any, res: any) {
  res.redirect('back');
}