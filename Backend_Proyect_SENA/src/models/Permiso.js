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




    const datosPermisos = [

        // Estado
        { nombrePermiso: 'Obtener Estados' },
        { nombrePermiso: 'Vista Estado' },

        // Usuario
        { nombrePermiso: 'Crear Usuario' },
        { nombrePermiso: 'Obtener Usuarios' },
        { nombrePermiso: 'Modificar Usuario'},
        { nombrePermiso: 'vista Usuario'},

        // Rol
        { nombrePermiso: 'Crear Rol' },
        { nombrePermiso: 'Obtener Roles' },
        { nombrePermiso: 'Modificar Rol'},
        { nombrePermiso: 'vista Roles'},

        // Permiso
        { nombrePermiso: 'Obtener Permisos' },
        { nombrePermiso: 'vista Permisos'},

        // Categoria
        { nombrePermiso: 'Crear Categoria' },
        { nombrePermiso: 'Obtener Categorias' },
        { nombrePermiso: 'Modificar Categoria'},
        { nombrePermiso: 'vista Categorias'},

        // subcategoria
        { nombrePermiso: 'Crear Subcategoria' },
        { nombrePermiso: 'Obtener Subcategorias' },
        { nombrePermiso: 'Modificar Sucategoria'},
        { nombrePermiso: 'vista Subcategorias'},

        // Instructor
        { nombrePermiso: 'Crear Instructor' },
        { nombrePermiso: 'Obtener Intructores' },
        { nombrePermiso: 'Modificar Intructor'},
        { nombrePermiso: 'vista Intructores'},

        // ficha
        { nombrePermiso: 'Crear Ficha' },
        { nombrePermiso: 'Obtener Fichas' },
        { nombrePermiso: 'Modificar Ficha'},
        { nombrePermiso: 'vista Fichas'},

        // Producto
        { nombrePermiso: 'Crear Producto' },
        { nombrePermiso: 'Obtener Productos' },
        { nombrePermiso: 'Modificar Producto'},
        { nombrePermiso: 'vista Productos'},

         // Herramienta
         { nombrePermiso: 'Crear Herramienta' },
         { nombrePermiso: 'Obtener Herramientas' },
         { nombrePermiso: 'Modificar Herramienta'},
         { nombrePermiso: 'vista Herramientas'},

          // Prestamo
        { nombrePermiso: 'Crear Prestamo' },
        { nombrePermiso: 'Obtener Prestamos' },
        { nombrePermiso: 'Modificar Prestamo'},
        { nombrePermiso: 'vista Prestamos'},

         // Pedido
         { nombrePermiso: 'Crear Pedido' },
         { nombrePermiso: 'Obtener Pedidos' },
         { nombrePermiso: 'Modificar Pedido'},
         { nombrePermiso: 'vista Pedidos'},

          // Unidad medida
        { nombrePermiso: 'Crear Unidad medida' },
        { nombrePermiso: 'Obtener Unidades medida' },
        { nombrePermiso: 'Modificar Unidad medida'},
        { nombrePermiso: 'vista Unidades medida'},

         // Usuario
         { nombrePermiso: 'Crear ' },
         { nombrePermiso: 'Obtener' },
         { nombrePermiso: 'Modificar'},
         { nombrePermiso: 'vista'},

    ];

    export default Permiso;