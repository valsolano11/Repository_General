
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import UsuarioRouter from "./routes/Usuario.routes.js";
import RolRouter from "./routes/Rol.routes.js";
import EstadoRouter from "./routes/Estado.routes.js";
import LoginRouter from "./routes/Login.routes.js";
import recuperacionRouter from "./routes/Olvidarcontrasena.routes.js";
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

app.use(
    
    UsuarioRouter, 
    RolRouter, 
    EstadoRouter,
    LoginRouter,
    recuperacionRouter
);

export default app;
