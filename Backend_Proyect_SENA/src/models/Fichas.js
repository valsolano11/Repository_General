import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";

const Fichas = conexion.define('Fichas',
    {

        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        NumeroFicha:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:{
                notEmpty:{
                    msg: "No puede dejar este campo vacio"
                }
            }
        },
        Programa:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:{
                notEmpty:{
                    mgs: "No puedes dejar este campo vacio"
                }
            }
        },
        Jornada: {
            type: DataTypes.STRING,
            allowNull
        }
    }
)