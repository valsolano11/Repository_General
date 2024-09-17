import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";

const Rol = conexion.define(
  "Rol",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    rolName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "El valor no puede estar vacio",
        },
      },
    },
  },
  {
    tableName: "Roles",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["rolName"],
      },
    ],
    hooks: {
      beforeSave: (rol) => {
        rol.rolName = rol.rolName.toLowerCase();
      },
    },
  }
);

const insertarRoles = async (datos) => {
  try {
    await Rol.sync();

    for (const rol of datos) {
      const [created] = await Rol.findOrCreate({
        where: { rolName: rol.rolName.toLowerCase() },
        defaults: { ...rol, rolName: rol.rolName.toLowerCase() },
      });

      if (!created) {
        console.log(`El rol ${rol.rolName} ya existe.`);
      }
    }
  } catch (error) {
    console.error("Error al insertar roles:", error.message);
    throw new Error(error.message);
  }
};

insertarRoles([{ rolName: "ADMIN" }, { rolName: "USUARIO" }]);

export default Rol;
