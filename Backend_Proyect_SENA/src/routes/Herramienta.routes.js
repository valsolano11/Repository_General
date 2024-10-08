import { Router } from "express";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { getAllHerramientas,buscarHerramientas,crearHerramientas,getHerramienta,actualizarHerramienta } from "../controllers/Productos/Herrramientas.controller.js";


const HerramientaRouter = Router();

HerramientaRouter.get("/herramienta", rutaProtegida, getAllHerramientas);
HerramientaRouter.get("/herramienta/busqueda", buscarHerramientas);
HerramientaRouter.get("/herramienta/:id", rutaProtegida, getHerramienta);
HerramientaRouter.post("/herramienta", rutaProtegida, crearHerramientas);
HerramientaRouter.put("/herramienta/:id", rutaProtegida, actualizarHerramienta);

export default HerramientaRouter;
