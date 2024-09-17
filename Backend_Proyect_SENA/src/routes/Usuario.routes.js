import { Router } from "express";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { crearUsuario, getAllusuario, getUsuario, Putusuario } from "../controllers/Usuarios/Usuario.controllers.js";
import { usuarioSchemas } from "../schemas/Usuario.schemas.js";

const UsuarioRouter = Router();

UsuarioRouter.get("/usuarios", getAllusuario);
UsuarioRouter.get("/usuarios/:id", getUsuario);
UsuarioRouter.post("/usuarios", validarSchemas(usuarioSchemas), crearUsuario);
UsuarioRouter.put("/usuarios/:id", Putusuario);

export default UsuarioRouter;
