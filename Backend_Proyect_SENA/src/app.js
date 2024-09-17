
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* app.use(

);
 */
export default app;
