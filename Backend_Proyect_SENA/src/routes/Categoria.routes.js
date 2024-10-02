import { Router } from "express";
import { crearCategoria, getAllCategoria, getCategoria, putCategoria } from  "../controllers/Productos/Categoria.controllers.js";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { CategoriaSchema } from "../schemas/Categoria.schemas.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";


const CategoriaRouter = Router()

CategoriaRouter.get("/categorias", rutaProtegida,validarPermiso('Vista Categorias'), getAllCategoria);
CategoriaRouter.get("/categorias/:id", rutaProtegida,validarPermiso('Obtener Categorias'), getCategoria);
CategoriaRouter.post("/categorias", rutaProtegida,/* validarPermiso('Crear Categoria'), */ validarSchemas(CategoriaSchema), crearCategoria);
CategoriaRouter.put("/categorias/:id", rutaProtegida,validarPermiso('Modificar Categoria'), putCategoria)

export default CategoriaRouter;