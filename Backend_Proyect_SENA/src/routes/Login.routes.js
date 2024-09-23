import { Router } from "express";
import { login, logout, perfil } from "../controllers/Usuarios/Login.controllers.js";
import validarSchemas from "../middlewares/ValidarSchemas.js"
import { loginSchemas } from "../schemas/Login.schemas.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";

const LoginRouter = Router();

LoginRouter.post("/login", validarSchemas(loginSchemas), login);
LoginRouter.post("/logout", logout);
LoginRouter.get("/perfil", rutaProtegida, perfil);

export default LoginRouter;