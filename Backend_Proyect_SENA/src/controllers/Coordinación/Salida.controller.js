import { Op, ValidationError } from "sequelize";
import Producto from "../../models/Producto.js";
import Pedido from "../../models/Pedido.js";
import PedidoProducto from "../../models/PedidoProducto.js";
import nodemailer from "nodemailer";
import Estado from "../../models/Estado.js";

export const actualizarSalidaProducto = async (req, res) => {
  const { id } = req.params; 
  const { productos } = req.body; 

  console.log("Datos recibidos para actualizar salida:", req.body);

  try {
    const pedido = await Pedido.findByPk(id, {
      include: [{ model: Producto, through: { attributes: ['cantidadSalida', 'cantidadSolicitar'] } }],
    });

    if (!pedido) {
      return res.status(404).json({ message: `Pedido con id ${id} no encontrado.`});
    }
    for (const producto of productos) {
      if (typeof producto.cantidadSalida !== 'number' || isNaN(producto.cantidadSalida) || producto.cantidadSalida < 0) {
          return res.status(400).json({ message: `La cantidad de salida para el producto ${producto.ProductoId} no es válida.` });
      }
  }

    for (const producto of productos) {
      const pedidoProducto = await PedidoProducto.findOne({
        where: {
          PedidoId: pedido.id,
          ProductoId: producto.ProductoId,
        },
      });

      if (!pedidoProducto) {
        return res.status(404).json({ message: `El producto con id ${producto.ProductoId} no está asociado a este pedido.` });
      }

      const cantidadSolicitar = pedidoProducto.cantidadSolicitar - pedidoProducto.cantidadSalida;
      if (producto.cantidadSalida > cantidadSolicitar) {
        return res.status(400).json({ message: `La cantidad solicitada para el producto ${producto.ProductoId} excede la cantidad disponible.` });
      }

      pedidoProducto.cantidadSalida += producto.cantidadSalida;
      await pedidoProducto.save();

      const productoData = await Producto.findByPk(producto.ProductoId);
      if (!productoData) {
        return res.status(404).json({ message: `Producto con id ${producto.ProductoId} no encontrado.` });
      }

     
      if (productoData.cantidadActual < producto.cantidadSalida) {
        return res.status(400).json({ message: `No hay suficiente cantidad en inventario para el producto ${producto.ProductoId}.` });
      }

      productoData.cantidadActual -= producto.cantidadSalida; 
      productoData.cantidadSalida = (productoData.cantidadSalida || 0) + producto.cantidadSalida; 
      
      if (productoData.cantidadActual <= 2) {
        const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
        if (estadoAgotado) {
          productoData.EstadoId = estadoAgotado.id; 
        }
      }

      await productoData.save();
    }

    try {
      console.log("Enviando correo de notificación para el pedido:", pedido);
      console.log("Correo del pedido:", pedido.correo); 
      await enviarCorreoNotificacion(pedido);
      console.log("Correo enviado exitosamente");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }

    return res.status(200).json({ message: "Salida de productos actualizada con éxito", pedido });

  } catch (error) {
    console.error("Error al actualizar la salida de productos:", error);
    return res.status(500).json({ message: "Error al actualizar la salida de productos." });
  }
};

const enviarCorreoNotificacion = async (pedido) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: "inventariodelmobiliario@gmail.com",
      pass: "xieo yngh kruv rsta", 
    },
  });

  const mailOptions = {
    from: 'inventariodelmobiliario@gmail.com',
    to: pedido.correo, 
    subject: 'Notificación de salida de productos',
    text:` El pedido con ID ${pedido.id} ha sido actualizado y está listo para ser recogido.`,
  };

  await transporter.sendMail(mailOptions);
};