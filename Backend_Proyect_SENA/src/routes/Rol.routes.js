import { Router } from "express";
import { crearRol, getAllRol, getRol, putRoles } from "../controllers/Usuarios/Rol.controllers.js";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import {rutaProtegida} from "../middlewares/ValidarToken.js"
import { rolSchemas } from "../schemas/Rol.schemas.js";

const RolRouter = Router();

RolRouter.get("/Rol", getAllRol);
RolRouter.get("/Rol/:id", getRol);
RolRouter.post("/Rol",rutaProtegida, validarSchemas(rolSchemas), crearRol);
RolRouter.put("/Rol/:id", putRoles);

export default RolRouter;
