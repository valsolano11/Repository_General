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

export { DetallePermiso};
