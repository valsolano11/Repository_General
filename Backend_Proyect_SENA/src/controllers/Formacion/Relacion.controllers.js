import Instructores from '../../models/Instructores.js';
import Fichas from '../../models/Fichas.js';
import InstructorFicha from '../../models/FI_IN.js';

// Crear o actualizar un Instructor y su relación con las Fichas
export const asignarInstructorAFichas = async (req, res) => {
  try {
    const { nombreInstructor, correoInstructor, celularInstructor, fichas, semestre } = req.body;

    // Verificar si el instructor ya existe
    let instructor = await Instructores.findOne({ where: { correo: correoInstructor } });
    if (!instructor) {
      // Crear instructor si no existe
      instructor = await Instructores.create({
        nombre: nombreInstructor,
        correo: correoInstructor,
        celular: celularInstructor,
      });
    }

    // Procesar cada ficha proporcionada
    for (const fichaData of fichas) {
      const { numeroFicha, programaFicha, jornadaFicha } = fichaData;

      // Verificar si la ficha ya existe
      let ficha = await Fichas.findOne({ where: { NumeroFicha: numeroFicha } });
      if (!ficha) {
        // Crear ficha si no existe
        ficha = await Fichas.create({
          NumeroFicha: numeroFicha,
          Programa: programaFicha,
          Jornada: jornadaFicha,
        });
      }

      // Relacionar Instructor con Ficha y Semestre
      await InstructorFicha.findOrCreate({
        where: {
          InstructorId: instructor.id,
          FichaId: ficha.id,
          semestre: semestre,  // Relacionar con el semestre actual
        },
      });
    }

    res.status(200).json({ message: 'Instructor y fichas relacionados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocurrió un error al relacionar instructor y fichas' });
  }
};
