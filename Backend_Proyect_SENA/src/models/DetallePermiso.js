import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import { Permiso } from "./Permiso.js";
import { Usuario } from "./Usuario.js";

const DetallePermiso = conexion.define(
    "DetallePermiso",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
},{
    tableName: "DetallePermisos",
    timestamps: false,
});

DetallePermiso.belongsTo(Permiso, {foreignKey: "PermisoId"});
DetallePermiso.belongsTo(Usuario, {foreignKey: "UsuarioId"});

export default DetallePermiso;