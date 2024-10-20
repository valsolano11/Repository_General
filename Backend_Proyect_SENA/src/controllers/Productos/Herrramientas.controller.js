import { Op } from "sequelize";
import Herramienta from "../../models/Herramientas.js";
import Usuario from "../../models/Usuario.js";
import Subcategoria from "../../models/Subcategoria.js";
import Estado from "../../models/Estado.js";
import { createNotification } from "../../helpers/Notificacion.helpers.js";

export const crearHerramienta = async (req, res) => {
    try {
        const { nombre, codigo, marca, condicion, observaciones, EstadoId, SubcategoriaId } = req.body;
        const UsuarioId = req.usuario.id;
        const usuarioNombre = req.usuario.nombre; 

        const consultaCodigo = await Herramienta.findOne({ where: { codigo } });
        if (consultaCodigo) {
            return res.status(400).json({ error: 'El código de la herramienta ya existe' });
        }

        const consultaUsuario = await Usuario.findByPk(UsuarioId);
        if (!consultaUsuario) {
            return res.status(400).json({ message: "El usuario especificado no existe" });
        }

        const consultaSubcategoria = await Subcategoria.findByPk(SubcategoriaId, {
            include: [{ model: Estado, as: 'Estado' }]
        });
        if (!consultaSubcategoria) {
            return res.status(400).json({ message: "La subcategoría especificada no existe" });
        }

        if (consultaSubcategoria.Estado.estadoName !== 'ACTIVO') {
            return res.status(400).json({ error: 'La subcategoría no está en estado ACTIVO' });
        }

        let estadoId = EstadoId;
        if (condicion === 'MALO') {
            const estadoInactivo = await Estado.findOne({ where: { estadoName: 'INACTIVO' } });
            if (!estadoInactivo) {
                return res.status(500).json({ error: 'Estado INACTIVO no encontrado' });
            }
            estadoId = estadoInactivo.id;
        } else {
            const consultaEstado = await Estado.findByPk(EstadoId);
            if (!consultaEstado) {
                return res.status(400).json({ message: "El estado especificado no existe" });
            }
        }

        const herramienta = await Herramienta.create({
            nombre,
            codigo,
            marca,
            condicion,
            observaciones,
            UsuarioId: UsuarioId, 
            EstadoId: estadoId,
            SubcategoriaId
        });

        const mensajeNotificacion = `El usuario ${usuarioNombre} agregó una nueva herramienta: (${herramienta.nombre}, con el codigo: ${herramienta.codigo}) el ${new Date().toLocaleDateString()}.`;
        await createNotification(UsuarioId, 'CREATE', mensajeNotificacion);

        res.status(201).json(herramienta);
    } catch (error) {
        console.error("Error al crear la herramienta", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllHerramienta = async (req, res) =>{
    try {
        let consultaHerramieta = await Herramienta.findAll({
            attributes: null,
            include: [
                { model: Usuario, attributes: ['nombre',] },
                { model: Subcategoria, attributes: ['subcategoriaName'] },
                { model: Estado, attributes: ['estadoName'] },
            ]
        });
        res.status(200).json(consultaHerramieta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getHerramienta = async (req, res) =>{
    try {
        let consultaHerramieta = await Herramienta.findByPk(req.params.id);

        if(!consultaHerramieta){
            return res.status(404).json({ message: "Herramienta no encontrada" });
        }
        res.status(200).json(consultaHerramieta)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const putHerramienta = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, codigo, marca, condicion, observaciones, EstadoId, SubcategoriaId } = req.body;
        const UsuarioId = req.usuario.id;
        const usuarioNombre = req.usuario.nombre; 

        const herramienta = await Herramienta.findByPk(id);
        if (!herramienta) {
            return res.status(404).json({ message: "Herramienta no encontrada" });
        }

        if (codigo) {
            const consultaCodigo = await Herramienta.findOne({ where: { codigo, id: { [Op.ne]: id } } });
            if (consultaCodigo) {
                return res.status(400).json({ error: 'El código de la herramienta ya existe' });
            }
        }

        if (UsuarioId) {
            const consultaUsuario = await Usuario.findByPk(UsuarioId);
            if (!consultaUsuario) {
                return res.status(400).json({ message: "El usuario especificado no existe" });
            }
        }

        if (SubcategoriaId) {
            const consultaSubcategoria = await Subcategoria.findByPk(SubcategoriaId, {
                include: [{ model: Estado, as: 'Estado' }]
            });
            if (!consultaSubcategoria) {
                return res.status(400).json({ message: "La subcategoría especificada no existe" });
            }

            if (consultaSubcategoria.Estado.estadoName !== 'ACTIVO') {
                return res.status(400).json({ error: 'La subcategoría no está en estado ACTIVO' });
            }
            herramienta.SubcategoriaId = SubcategoriaId;
        }

        if (condicion === 'MALO') {
            const estadoInactivo = await Estado.findOne({ where: { estadoName: 'INACTIVO' } });
            if (!estadoInactivo) {
                return res.status(500).json({ error: 'Estado INACTIVO no encontrado' });
            }
            herramienta.EstadoId = estadoInactivo.id;
        } else if (EstadoId) {
            const consultaEstado = await Estado.findByPk(EstadoId);
            if (!consultaEstado) {
                return res.status(400).json({ message: "El estado especificado no existe" });
            }
            herramienta.EstadoId = EstadoId;
        }

        herramienta.nombre = nombre || herramienta.nombre;
        herramienta.codigo = codigo || herramienta.codigo;
        herramienta.marca = marca || herramienta.marca;
        herramienta.condicion = condicion || herramienta.condicion;
        herramienta.observaciones = observaciones || herramienta.observaciones;
        herramienta.UsuarioId = UsuarioId;

        await herramienta.save();
        const mensajeNotificacion = `El usuario ${usuarioNombre} edito la herramienta: (${herramienta.nombre}, con el codigo: ${herramienta.codigo}) el ${new Date().toLocaleDateString()}.`;
        await createNotification(UsuarioId, 'UPDATE', mensajeNotificacion);


        res.status(200).json(herramienta);
    } catch (error) {
        console.error("Error al actualizar la herramienta", error);
        res.status(500).json({ message: error.message });
    }
};


export const buscarHerramientas = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Debe ingresar un término de búsqueda." });
        }

        const herramientas = await Herramienta.findAll({
            where: {
                nombre: {
                    [Op.like]:`%${query}%`,
                },
              EstadoId: 1, // Solo se debe buscar herramientas con EstadoId 1
            },
            attributes: ["id", "nombre", "codigo"],
        });

        if (herramientas.length === 0) {
            return res.status(404).json({ message: "No se encontraron herramientas." });
        }

        res.status(200).json(herramientas);
    } catch (error) {
        console.error("Error al obtener sugerencias de herramientas", error);
        res.status(500).json({ message: "Error al obtener sugerencias de herramientas" });
    }
};
