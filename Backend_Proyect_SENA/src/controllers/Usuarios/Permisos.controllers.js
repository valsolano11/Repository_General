import Permiso from "../models/Permiso.js";

export const getAllPermisos = async (req, res )=> {
 
    try {
        let permiso = await Permiso.finAll({
            atributes: {nombrePermiso},
        });
        res.status(200).json(permisos);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
   
}
