import { Router } from "express";
import { crearProductos, getAllProductos, getProductos } from  "../controllers/Productos/Productos.controllers.js";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { ProductoSchemas } from "../schemas/Producto.schemas.js";
import { validarPermiso } from "../middlewares/ValiadarPermisos.js";


const ProductoRouter = Router()

ProductoRouter.get("/producto", rutaProtegida, getAllProductos);
ProductoRouter.get("/producto/:id", rutaProtegida, getProductos );
ProductoRouter.post("/producto", rutaProtegida, validarPermiso('Crear Producto') ,validarSchemas(ProductoSchemas), crearProductos);

export default ProductoRouter; 