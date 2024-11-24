import express from "express";

const app = express();

app.get("/", function (req, res) {
  const reqBody = req.body;
  const reqQuery = req.query;
  const reqQueryTest = req.query.test;
  const reqOther = req.params.other;
  const reqOtherNested = req.params.other.nested;
});

app.get("/", function (request, response) {
  const reqBody = request.body;
  const reqQuery = request.query;
  const reqQueryTest = request.query.test;
  const reqOther = request.params.other;
  const reqOtherNested = request.params.other.nested;
});

app.get("/", (req, res) => {
  const reqBody = req.body;
  const reqQuery = req.query;
  const reqQueryTest = req.query.test;
  const reqOther = req.params.other;
  const reqOtherNested = req.params.other.nested;
});

app.get("/", (request, response) => {
  const reqBody = request.body;
  const reqQuery = request.query;
  const reqQueryTest = request.query.test;
  const reqOther = request.params.other;
  const reqOtherNested = request.params.other.nested;
});

app.param(function () {
    // my important logic
})