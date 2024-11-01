import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

// CORS
app.use(cors());

// ROUTES
app.use("/api/naive-bayes", require("./routes/NaiveBayes"));


app.get("/", (req: any, res: any) => {
  console.log("Hello world");
  return res.status(200).json({ message: "Hi there! This is a backend project for Naive Bayes Classifier with Express.js. Check my GitHub: https://github.com/Hikmahx/naive-bayes-api for more info" });
});

app.listen(PORT, () => console.log("This is listening on PORT: " + PORT));
