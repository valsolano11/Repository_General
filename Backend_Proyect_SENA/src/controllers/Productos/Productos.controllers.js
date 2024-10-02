import { Op } from "sequelize"; 
import Producto from "../../models/Producto.js";
import Usuario from "../../models/Usuario.js";
import Subcategoria from "../../models/Subcategoria.js";
import Estado from "../../models/Estado.js";
import UnidadDeMedida from "../../models/UnidadMedida.js";

export const crearProductos = async (req, res) => {
    try {
        const {
            nombre,
            codigo,
            descripcion,
            cantidadEntrada,
            marca,
            EstadoId,
            SubcategoriaId,
            UnidadMedidaId,
        } = req.body;

        const UsuarioId = req.usuario.id;

        const consultaCodigo = await Producto.findOne({
            where: { [Op.or]: [{ codigo }] },
        });
        if (consultaCodigo) {
            return res.status(400).json({ error: "El código del producto ya existe" });
        }

        const consultaUsuario = await Usuario.findByPk(UsuarioId);
        if (!consultaUsuario) {
            return res.status(400).json({ message: "El usuario especificado no existe" });
        }

        const consultaUnidad = await UnidadDeMedida.findByPk(UnidadMedidaId);
        if (!consultaUnidad) {
            return res.status(400).json({ message: "La unidad de medida especificada no existe" });
        }

        const consultaSubcategoria = await Subcategoria.findByPk(SubcategoriaId);
        if (!consultaSubcategoria) {
            return res.status(400).json({ message: "La subcategoría especificada no existe" });
        }

        const consultaEstado = await Estado.findByPk(EstadoId);
        if (!consultaEstado) {
            return res.status(400).json({ message: "El estado especificado no existe" });
        }

        const cantidadSalida = 0;
        const cantidadActual = cantidadEntrada;
        let estadoIdActual;

        if (cantidadActual < 2) {
            const estadoAgotado = await Estado.findOne({ where: { estadoName: "AGOTADO" } });
            if (estadoAgotado) {
                estadoIdActual = estadoAgotado.id; 
            }
        } else {
            const estadoActivo = await Estado.findOne({ where: { estadoName: "ACTIVO" } });
            if (estadoActivo) {
                estadoIdActual = estadoActivo.id; 
            }
        }

        const volumenTotalCalculado = `${cantidadActual} ${consultaUnidad.sigla}`; 

        const producto = await Producto.create({
            nombre,
            codigo,
            descripcion,
            cantidadEntrada,
            cantidadSalida,
            cantidadActual,
            marca,
            VolumenTotal: volumenTotalCalculado,
            UsuarioId,
            UnidadMedidaId,
            SubcategoriaId,
            EstadoId: estadoIdActual || EstadoId, 
        });

        res.status(201).json({
            ...producto.toJSON(),
            unidadDeMedida: consultaUnidad.nombre,
            cantidadActual,
        });
    } catch (error) {
        console.error("Error al crear el producto", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllProductos = async (req, res) => {
    try {
        let consultaProducto = await Producto.findAll({
          attributes: null,
          include: [
            { model: Usuario, attributes: ["nombre"] },
            { model: Subcategoria, attributes: ["subcategoriaName"] },
            { model: Estado, attributes: ["estadoName"] },
            { model: UnidadDeMedida, attributes: ["nombre"] },
          ],
        });
        res.status(200).json(consultaProducto);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const getProductos = async (req, res) => {
    try {
        let consultaProducto = await Producto.findByPk(req.params.id);

        if(!consultaProducto){
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(consultaProducto)
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};