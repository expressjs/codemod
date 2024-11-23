import express from "express";

const app = express();

app.get("/", function (req, res) {
  const reqBody = req.param('body');
  const reqQuery = req.param('query');
  const reqOther = req.param('other');
});

app.get("/", function (request, response) {
  const reqBody = request.param('body');
  const reqQuery = request.param('query');
  const reqOther = request.param('other');
});

app.get("/", (req, res) => {
  const reqBody = req.param('body');
  const reqQuery = req.param('query');
  const reqOther = req.param('other');
});

app.get("/", (request, response) => {
  const reqBody = request.param('body');
  const reqQuery = request.param('query');
  const reqOther = request.param('other');
});

app.param(function () {
    // my important logic
})