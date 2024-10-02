
import UnidadMedida from '../../models/UnidadMedida.js';


export const getAllUnits = async (req, res) => {
    try {
        const unidades = await UnidadMedida.findAll();
        res.status(200).json(unidades);
    } catch (error) {
        console.error("Error al obtener las unidades de medida", error);
        res.status(500).json({ error: 'Error al obtener las unidades de medida' });
    }
};

export const getUnitById = async (req, res) => {
    const { id } = req.params;
    try {
        const unidad = await UnidadMedida.findByPk(id);
        if (!unidad) {
            return res.status(404).json({ error: 'Unidad de medida no encontrada' });
        }
        res.status(200).json(unidad);
    } catch (error) {
        console.error("Error al obtener la unidad de medida", error);
        res.status(500).json({ error: 'Error al obtener la unidad de medida' });
    }
};
