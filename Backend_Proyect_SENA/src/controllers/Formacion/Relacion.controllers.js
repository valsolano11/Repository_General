import Instructores from "../../models/Instructores.js";
import Fichas from "../../models/Fichas.js";
import InstructorFicha from "../../models/FI_IN.js";

export const asignarInstructorAFichas = async (req, res) => {
  try {
    const {
      nombreInstructor,
      correoInstructor,
      celularInstructor,
      fichas,
      semestre,
    } = req.body;

    const UsuarioId = req.usuario.id;
    let instructor = await Instructores.findOne({
      where: { correo: correoInstructor },
    });
    if (!instructor) {
      instructor = await Instructores.create({
        nombre: nombreInstructor,
        correo: correoInstructor,
        celular: celularInstructor,
        EstadoId: 1, 
        UsuarioId: UsuarioId,
      });
    }

    for (const fichaData of fichas) {
      const { numeroFicha, programaFicha, jornadaFicha } = fichaData;

      let ficha = await Fichas.findOne({ where: { NumeroFicha: numeroFicha } });
      if (!ficha) {

        ficha = await Fichas.create({
          NumeroFicha: numeroFicha,
          Programa: programaFicha,
          Jornada: jornadaFicha,
          EstadoId: 1, 
          UsuarioId: UsuarioId, 
        });
      }

      await InstructorFicha.findOrCreate({
        where: {
          InstructorId: instructor.id,
          FichaId: ficha.id,
          semestre: semestre, 
        },
      });
    }

    res.status(200).json({ message: "Instructor y fichas relacionados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al relacionar instructor y fichas" });
  }
};
