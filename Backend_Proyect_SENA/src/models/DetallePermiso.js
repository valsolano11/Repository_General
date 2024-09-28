import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Usuario from "./Usuario.js";
import Permiso from "./Permiso.js";

// Definir el modelo DetallePermiso
const DetallePermiso = conexion.define(
  "DetallePermiso",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    tableName: "DetallePermisos",
    timestamps: false,
  }
);

  Usuario.hasMany(DetallePermiso, { foreignKey: "UsuarioId" });
  Permiso.hasMany(DetallePermiso, { foreignKey: "PermisoId" });
  DetallePermiso.belongsTo(Usuario, { foreignKey: "UsuarioId" });
  DetallePermiso.belongsTo(Permiso, { foreignKey: "PermisoId" });

DetallePermiso.afterSync(async () => {
  try {
    // Verificar si el usuario administrador ya tiene permisos asignados
    const permisosAdmin = await DetallePermiso.findOne({
      where: { UsuarioId: 1 },
    });

    if (!permisosAdmin) {
      // Si no tiene permisos, asignar todos los permisos disponibles
      const permisos = await Permiso.findAll();

      const permisosDetalle = permisos.map((permiso) => ({
        UsuarioId: 1, // El ID del administrador
        PermisoId: permiso.id, // Asignar cada permiso al administrador
      }));

      // Insertar los permisos en la tabla DetallePermiso
      await DetallePermiso.bulkCreate(permisosDetalle);

      console.log("Todos los permisos han sido asignados al administrador.");
    } else {
      console.log("El administrador ya tiene permisos asignados.");
    }
  } catch (error) {
    console.error("Error al asignar permisos al administrador:", error);
  }
});
  
export default DetallePermiso;
