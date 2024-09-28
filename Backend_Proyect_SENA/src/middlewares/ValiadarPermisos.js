import Permiso from "../models/Permiso.js";
import DetallePermiso from "../models/DetallePermiso.js";


export const validarPermiso = (nombrePermiso) => {
  return async (req, res, next) => {
    try {
      if (!req.usuario || !req.usuario.id) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const { id: usuarioId } = req.usuario;

      const permiso = await Permiso.findOne({
        where: { nombre: nombrePermiso },
      });
      if (!permiso) {
        return res.status(404).json({ message: `Permiso '${nombrePermiso}' no encontrado` });
      }

      const tienePermiso = await DetallePermiso.findOne({
        where: { UsuarioId: usuarioId, PermisoId: permiso.id },
      });

      if (!tienePermiso) {
        return res.status(403).json({ message: "No tienes permiso para realizar esta acción" });
      }

      next();
    } catch (error) {
      console.error("Error al verificar permiso:", error);
      res.status(500).json({ message: "Error interno al verificar permiso", error });
    }
  };
};
