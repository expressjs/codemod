import express from "express";

const app = express();

app.get("/", function (req, res) {
  const reqBody = req.param('body');
  const reqQuery = req.param('query');
  const reqQueryTest = req.param('query').test;
  const reqOther = req.param('other');
  const reqOtherNested = req.param('other').nested;
});

app.get("/", function (request, response) {
  const reqBody = request.param('body');
  const reqQuery = request.param('query');
  const reqQueryTest = request.param('query').test;
  const reqOther = request.param('other');
  const reqOtherNested = request.param('other').nested;
});

app.get("/", (req, res) => {
  const reqBody = req.param('body');
  const reqQuery = req.param('query');
  const reqQueryTest = req.param('query').test;
  const reqOther = req.param('other');
  const reqOtherNested = req.param('other').nested;
});

app.get("/", (request, response) => {
  const reqBody = request.param('body');
  const reqQuery = request.param('query');
  const reqQueryTest = request.param('query').test;
  const reqOther = request.param('other');
  const reqOtherNested = request.param('other').nested;
});

app.param(function () {
    // my important logic
})