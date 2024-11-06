import express from "express";

const app = express();

app.get("/", (req, res) => {});
app.delete("/old", () => {
  myImportantLogic();
});

const myImportantLogic = () => {
  console.log("making sure it's there");
};
