import express from "express";

const app = express();

app.get("/", (req, res) => {});

app.delete([""],() => {
  myImportantLogic();
});

app.delete([],() => {
  myImportantLogic();
});

app.delete(/d/,() => {
  myImportantLogic();
});

app.del(() => {
  myImportantLogic();
});

app.del(function () {
  myImportantLogic();
});

app.delete("/old", () => {
  myImportantLogic();
});

function noModify() {
  let a

  app.del(a)
}

const myImportantLogic = () => {
  console.log("making sure it's there");
};
