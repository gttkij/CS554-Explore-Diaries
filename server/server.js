// server.js
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import configRoutes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
); //MIGHT CHANGE
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthenticationState",
    secret: "ssshh secret",
    resave: false,
    saveUninitialized: false,
  })
);

configRoutes(app);

// IF FRONTEND ENDS UP RUNNING ON 3000, CHANGE THIS TO 3001:-
app.listen(3000, () => {
  console.log("Backend is running on http://localhost:3000");
});
