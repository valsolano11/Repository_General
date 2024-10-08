import { Op } from "sequelize";
import Herramienta from "../../models/Herramientas.js";
import Usuario from "../../models/Usuario.js";
import Subcategoria from "../../models/Subcategoria.js";
import Estado from "../../models/Estado.js";
import UnidadDeMedida from "../../models/UnidadMedida.js";

export const crearHerramientas = async (req, res) => {
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
            condicion,
            observaciones,
        } = req.body;

        const UsuarioId = req.usuario.id;

        const consultaCodigo = await Herramienta.findOne({
            where: { [Op.or]: [{ codigo }] },
        });
        if (consultaCodigo) {
            return res.status(400).json({ error: "El código de la herramienta ya existe" });
        }

        // Verificar la existencia de las relaciones
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

        // Inicializar cantidades
        const cantidadSalida = 0;
        const cantidadActual = cantidadEntrada;
        let estadoIdActual;

        // Determinar el estado inicial basado en la cantidad actual
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

        // Crear la herramienta
        const herramienta = await Herramienta.create({
            nombre,
            codigo,
            descripcion,
            cantidadEntrada,
            cantidadSalida,
            cantidadActual,
            marca,
            condicion,
            observaciones,
            VolumenTotal: volumenTotalCalculado,
            UsuarioId,
            UnidadMedidaId,
            SubcategoriaId,
            EstadoId: estadoIdActual || EstadoId,
        });

        res.status(201).json({
            ...herramienta.toJSON(),
            unidadDeMedida: consultaUnidad.nombre,
            cantidadActual,
        });
    } catch (error) {
        console.error("Error al crear la herramienta", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllHerramientas = async (req, res) => {
    try {
        let consultaHerramienta = await Herramienta.findAll({
            attributes: null,
            include: [
                { model: Usuario, attributes: ["nombre"] },
                { model: Subcategoria, attributes: ["subcategoriaName"] },
                { model: Estado, attributes: ["estadoName"] },
                { model: UnidadDeMedida, attributes: ["nombre"] },
            ],
        });
        res.status(200).json(consultaHerramienta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHerramienta = async (req, res) => {
    try {
        let consultaHerramienta = await Herramienta.findByPk(req.params.id);

        if (!consultaHerramienta) {
            return res.status(404).json({ message: "Herramienta no encontrada" });
        }

        res.status(200).json(consultaHerramienta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const actualizarHerramienta = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, cantidadEntrada, volumen, marca, UnidadMedidaId, SubcategoriaId, EstadoId, condicion, observaciones } = req.body;
        const UsuarioId = req.usuario.id;

        const herramienta = await Herramienta.findByPk(id);

        if (!herramienta) {
            return res.status(404).json({ error: 'Herramienta no encontrada' });
        }

        if (nombre && nombre !== herramienta.nombre) {
            const existingHerramientaNombre = await Herramienta.findOne({ where: { nombre } });
            if (existingHerramientaNombre) {
                return res.status(400).json({ error: 'El nombre de la herramienta ya existe' });
            }
        }

        if (descripcion && descripcion.trim() === '') {
            return res.status(400).json({ error: 'La descripción no puede estar vacía' });
        }

        if (UsuarioId) {
            const usuario = await Usuario.findByPk(UsuarioId);
            if (!usuario) {
                return res.status(400).json({ error: 'El UsuarioId no existe' });
            }
        }

        if (UnidadMedidaId) {
            const unidadMedida = await UnidadDeMedida.findByPk(UnidadMedidaId);
            if (!unidadMedida) {
                return res.status(400).json({ error: 'El UnidadMedidaId no existe' });
            }
        }

        if (SubcategoriaId) {
            const subcategoria = await Subcategoria.findByPk(SubcategoriaId);
            if (!subcategoria) {
                return res.status(400).json({ error: 'El SubcategoriaId no existe' });
            }
        }

        if (EstadoId) {
            const estado = await Estado.findByPk(EstadoId);
            if (!estado) {
                return res.status(400).json({ error: 'El EstadoId no existe' });
            }
        }

        // Actualizar cantidad y estado
        if (cantidadEntrada !== undefined) {
            herramienta.cantidadEntrada = cantidadEntrada;
            herramienta.cantidadSalida = 0;
            herramienta.cantidadActual = cantidadEntrada;

            let estadoIdActual;
            if (cantidadEntrada < 2) {
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
            herramienta.EstadoId = estadoIdActual;
        }

        herramienta.nombre = nombre !== undefined ? nombre : herramienta.nombre;
        herramienta.volumen = volumen !== undefined ? volumen : herramienta.volumen;
        herramienta.descripcion = descripcion !== undefined ? descripcion : herramienta.descripcion;
        herramienta.marca = marca !== undefined ? marca : herramienta.marca;
        herramienta.UnidadMedidaId = UnidadMedidaId !== undefined ? UnidadMedidaId : herramienta.UnidadMedidaId;
        herramienta.SubcategoriaId = SubcategoriaId !== undefined ? SubcategoriaId : herramienta.SubcategoriaId;
        herramienta.condicion = condicion !== undefined ? condicion : herramienta.condicion;
        herramienta.observaciones = observaciones !== undefined ? observaciones : herramienta.observaciones;
        herramienta.UsuarioId = UsuarioId;

        await herramienta.save();

        res.json(herramienta);
    } catch (error) {
        console.error("Error al actualizar la herramienta", error);
        res.status(500).json({ error: 'Error al actualizar la herramienta' });
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
                    [Op.like]: `%${query}%`,
                },
                EstadoId: 1, // Suponiendo que EstadoId 1 significa 'ACTIVO'
            },
            attributes: ["id", "nombre", "marca"],
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
