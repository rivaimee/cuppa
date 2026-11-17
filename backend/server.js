import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MongoStore from "connect-mongo";
import passport from "./auth/passportConfig.js";
import authRouter from "./routes/auth.js";
import brewsRouter from "./routes/brews.js";
import tastingsRouter from "./routes/tastings.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/brews", brewsRouter);
app.use("/api/tastings", tastingsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Cuppa server running on port ${PORT}`);
});
