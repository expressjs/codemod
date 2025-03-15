import express from "express";

const app = express();

app.get("/", (req, res) => {});

app.del(() => {
  myImportantLogic();
});

app.del(function () {
  myImportantLogic();
});

app.del("/old", () => {
  myImportantLogic();
});

const myImportantLogic = () => {
  console.log("making sure it's there");
};
