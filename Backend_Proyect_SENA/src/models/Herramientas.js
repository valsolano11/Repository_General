import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Usuario from "./Usuario.js";
import Estado from "./Estado.js";
import Subcategoria from "./Subcategoria.js";
import UnidadMedida from "./UnidadMedida.js";

const Herramienta = conexion.define(
  "Herramienta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El nombre de la herramienta no puede estar vacío",
        },
      },
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El código de la herramienta no puede estar vacío",
        },
      },
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true, // Permite valores null
    
    },
    cantidadEntrada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La cantidad de entrada de la herramienta no puede estar vacía",
        },
      },
    },
    cantidadSalida: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidadActual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    VolumenTotal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La marca de la herramienta no puede estar vacía",
        },
      },
    },
    condicion: {
      type: DataTypes.ENUM("BUENO", "REGULAR", "MALO"),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Debe especificar la condición de la herramienta",
        },
      },
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Herramientas",
    timestamps: true,
  }
);

Herramienta.belongsTo(Usuario, { foreignKey: "UsuarioId" });
Herramienta.belongsTo(Estado, { foreignKey: "EstadoId" });
Herramienta.belongsTo(Subcategoria, { foreignKey: "SubcategoriaId" });
Herramienta.belongsTo(UnidadMedida, { foreignKey: "UnidadMedidaId" });

export default Herramienta;
