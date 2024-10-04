import express from 'express';
import upload from '../middlewares/UploadPePres.js'; // Ajusta la ruta según tu estructura de carpetas
import { actualizarPedido, crearPedido, obtenerPedidos } from '../controllers/Productos/Pedido.controllers.js';
import { actualizarSalidaProducto } from "../controllers/Coordinación/Salida.controller.js"; // Ajusta la ruta según la ubicación de tu controlador

const router = express.Router();

router.post('/pedido', crearPedido);
router.get('/pedido', obtenerPedidos);
router.put('/pedido/:id', upload.single('firma'), actualizarPedido);
router.put("/pedido/:id/salida", actualizarSalidaProducto);

export default router;
