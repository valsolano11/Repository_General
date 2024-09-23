
export const asignarPermiso = async (req, res)=>{
   /*  try {
        const { UsuarioId, PermisoId } = req.body;
        const UsuarioId = await Usuario.findByPk(usuarioId);
        const permiso = await Permiso.findByPk(permisoId);
  //jose quieto
        if (!usuario || !permiso) {
          return res.status(404).json({ message: 'Usuario o Permiso no encontrado' });
        }
  
        // Añadir el permiso al usuario en la tabla intermedia
        await UsuarioPermiso.create({ UsuarioId: usuario.id, PermisoId: permiso.id });
  
        res.status(200).json({ message: 'Permiso asignado al usuario exitosamente' });
      } catch (error) {
        res.status(500).json({ message: 'Error al asignar permiso al usuario', error });
      } */
}

export const getPermisos = async (req, res)=>{
    
}

export const putPermiso = async (req, res)=>{
    
}