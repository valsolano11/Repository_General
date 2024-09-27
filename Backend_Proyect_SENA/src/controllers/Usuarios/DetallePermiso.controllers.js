import Permiso from './../../models/Permiso.js';
import Usuario from './../../models/Usuario.js';
import { DetallePermiso } from '../../models/DetallePermiso.js';


export const crearUsuarioConPermisos = async (req, res) => {
  try {
    const { nombre, correo, password, Documento, RolId, EstadoId, permisos } = req.body;

    // Crear el usuario
    const nuevoUsuario = await Usuario.create({ nombre, correo, password, Documento, RolId, EstadoId });

    // Verificar si hay permisos seleccionados
    if (permisos && permisos.length > 0) {
      // Asignar los permisos al usuario
      const permisosAsignados = permisos.map(async (permisoId) => {
        const permiso = await Permiso.findByPk(permisoId);
        if (permiso) {
          await DetallePermiso.create({ UsuarioId: nuevoUsuario.id, PermisoId: permiso.id });
        }
      });
      
      // Esperar a que todas las promesas se resuelvan
      await Promise.all(permisosAsignados);
    }

    res.status(201).json({ message: 'Usuario creado y permisos asignados exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario y asignar permisos', error });
  }
};






export const getPermisosUsuario = async (req, res) => {
  try {
    const { id } = req.usuario; // Obtén el id del usuario desde el token verificado

    const permisosUsuario = await DetallePermiso.findAll({
      where: { UsuarioId: id }, // Utiliza el id del usuario
      include: {
        model: Permiso,
        attributes: ['nombrePermiso'], // Solo trae el nombre del permiso
      },
    });

    if (permisosUsuario.length === 0) {
      return res.status(404).json({ msg: 'Este usuario no tiene permisos asignados.' });
    }

    res.status(200).json(permisosUsuario);
  } catch (error) {
    console.error('Error al obtener permisos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener los permisos del usuario', error: error.message });
  }
};


export const putPermisosUsuario = async (req, res) => {
  try {
    const { UsuarioId, nuevosPermisos } = req.body; 

    const usuario = await Usuario.findByPk(UsuarioId);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado.' });
    }

    // Eliminar todos los permisos actuales
    await DetallePermiso.destroy({ where: { UsuarioId } });

    // Asignar nuevos permisos
    const permisosAsignados = nuevosPermisos.map((PermisoId) => ({
      UsuarioId,
      PermisoId,
    }));

    await DetallePermiso.bulkCreate(permisosAsignados);

    res.status(200).json({ message: 'Permisos actualizados exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar permisos:', error);
    res.status(500).json({ message: 'Error al actualizar permisos del usuario', error: error.message });
  }
};


export const deletePermiso = async (req, res) => {
  try {
    const { UsuarioId, PermisoId } = req.body;

    const permisoExistente = await DetallePermiso.findOne({
      where: { UsuarioId, PermisoId },
    });

    if (!permisoExistente) {
      return res.status(404).json({ msg: 'El permiso no está asignado al usuario.' });
    }

    // Eliminar el permiso asignado
    await permisoExistente.destroy();
    res.status(200).json({ message: 'Permiso eliminado del usuario exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el permiso:', error);
    res.status(500).json({ message: 'Error al eliminar el permiso del usuario', error: error.message });
  }
};
