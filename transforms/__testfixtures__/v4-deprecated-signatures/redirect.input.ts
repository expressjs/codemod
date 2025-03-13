import express from "express";
import { redirect } from "somelibrary";

const app = express();

app.get("/", function (req, res) {
  res.redirect("/other-page", 301);
});

app.get("/", function (req, response) {
  response.redirect("/other-page", 301);
});

app.get("/", function (req, res) {
  res.redirect(301, "/other-page");
});

app.get("/", function (req, res) {
  res.redirect("/other-page");
});

app.get("/", function (req, res) {
  redirect(301, "/other-page");
});