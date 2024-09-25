import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";


const Permiso = conexion.define("Permiso",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nombrePermiso: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              notEmpty: {
                msg: "No puedes dejar este campo vacio",
              },
            },
        }
    },{
        tableName: "Permisos",
        timestamps: false,
    });

    export default Permiso;