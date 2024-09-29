import { Router } from "express";
import { getAllPermisos } from "../controllers/Usuarios/Permisos.controllers.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { ValidacionAdmin } from "../middlewares/ValidacionAdmin.js";

const permisoRouter = Router()

permisoRouter.get("/permisos",rutaProtegida, ValidacionAdmin, getAllPermisos)

export default permisoRouter;
