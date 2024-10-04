import express from 'express';
import upload from '../middlewares/UploadPePres.js'; 
import { 
  actualizarPedido, 
  crearPedido, 
  getPedido, 
  getAllPedidos 
} from '../controllers/Productos/Pedido.controllers.js';
import { actualizarSalidaProducto } from "../controllers/Coordinación/Salida.controller.js"; 

const router = express.Router();

router.get('/pedido', getAllPedidos);
router.get('/pedido/:id', getPedido);
router.post('/pedido', crearPedido);
router.put('/pedido/:id', upload.single('firma'), actualizarPedido);
router.put("/pedido/:id/salida", actualizarSalidaProducto);

export default router;
