import express from "express";
import "dotenv/config";
import ConnectDb from "./config/db.js";
import authRouter from "./routes/auth.Router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.Router.js";
import geminiResponse from "./gemini.js";
const app = express();
const port = process.env.PORT;
app.use(cors({ origin: "https://ai-assist-0wdz.onrender.com", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.get("/", async (req, res) => {
  const prompt = req.query.prompt;
  const data = await geminiResponse(prompt);
  res.json(data);
});

app.listen(port, () => {
  ConnectDb();
  console.log(`server is listening on PORT: ${port}`);
});
