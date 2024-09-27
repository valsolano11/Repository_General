import { Router } from "express";
import { getAllPermisos } from "../controllers/Usuarios/Permisos.controllers.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";

const permisoRouter = Router()

permisoRouter.get("/permisos",rutaProtegida, getAllPermisos)

export default permisoRouter;
