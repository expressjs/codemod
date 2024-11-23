import express from "express";

const app = express();

app.get("/", function (req, res) {
  const reqBody = req.body;
  const reqQuery = req.query;
  const reqOther = req.params.other;
});

app.get("/", function (request, response) {
  const reqBody = request.body;
  const reqQuery = request.query;
  const reqOther = request.params.other;
});

app.get("/", (req, res) => {
  const reqBody = req.body;
  const reqQuery = req.query;
  const reqOther = req.params.other;
});

app.get("/", (request, response) => {
  const reqBody = request.body;
  const reqQuery = request.query;
  const reqOther = request.params.other;
});

app.param(function () {
    // my important logic
})