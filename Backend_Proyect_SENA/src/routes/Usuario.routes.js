import { Router } from "express";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { crearUsuario, getAllusuario, getUsuario, Putusuario } from "../controllers/Usuarios/Usuario.controllers.js";
import { usuarioSchemas } from "../schemas/Usuario.schemas.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";

const UsuarioRouter = Router();

UsuarioRouter.get("/usuarios",rutaProtegida, getAllusuario);
UsuarioRouter.get("/usuarios/:id",rutaProtegida, getUsuario);
UsuarioRouter.post("/usuarios",rutaProtegida, validarSchemas(usuarioSchemas), crearUsuario);
UsuarioRouter.put("/usuarios/:id",rutaProtegida, Putusuario);

export default UsuarioRouter;
