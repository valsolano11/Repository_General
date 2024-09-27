import { Router } from "express";
import { getAllPermisos } from "../controllers/Usuarios/Permisos.controllers.js";
import { validarPermiso } from "../middlewares/ValidarPermisos.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";

const permisoRouter = Router()

permisoRouter.get("/permisos",rutaProtegida, validarPermiso('Obtener Permisos' ), getAllPermisos)

export default permisoRouter;
