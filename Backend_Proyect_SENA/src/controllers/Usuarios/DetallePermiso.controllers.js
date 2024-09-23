
export const asignarPermiso = async (req, res)=>{
  try {
    const {UsuarioId, PermisoId}= req.body;
    const usuario = await Usuario.findById(UsuarioId);
    const permiso = await Permiso.findById(PermisoId);
 
    if(!usuario ||!permiso){
        return res.status(404).json({msg: 'Usuario o permiso no encontrado'});
    }
 
    if(usuario.permisos.includes(permiso._id)){
        return res.status(400).json({msg: 'El usuario ya tiene este permiso'});
    }
 
    await DetallePermiso.create({UsuarioId: usuario.id, PermisoId: permiso.id});
    
    res.status(200).json({ message: 'Permiso asignado al usuario exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar permiso al usuario', error });
    }
  }



export const getPermisos = async (req, res)=>{
    
}

export const putPermiso = async (req, res)=>{
    
}