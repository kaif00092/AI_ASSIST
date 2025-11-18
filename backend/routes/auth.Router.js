import express from "express";
import {
  Home,
  logIn,
  logOut,
  signUp,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);
authRouter.post("/", Home);
authRouter.post("/logout", logOut);

export default authRouter;
