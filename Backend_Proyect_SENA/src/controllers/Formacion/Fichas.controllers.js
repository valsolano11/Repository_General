import { Op } from "sequelize";
import Estado from "../../models/Estado.js";
import Ficha from "../../models/Fichas.js";
import Usuario from "../../models/Usuario.js";

export const crearFicha = async (req, res) => {
  try {
    const { EstadoId, NumeroFicha, Programa, Jornada } = req.body;
    const UsuarioId = req.usuario.id;

    const consultaId = await Ficha.findOne({
      where: { NumeroFicha },
    });
    if (consultaId) {
      return res.status(400).json({ message: "La ficha ya existe" });
    }

    const consultaUsuario = await Usuario.findByPk(UsuarioId);
    if (!consultaUsuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const consultaEstado = await Estado.findByPk(EstadoId);
    if (!consultaEstado) {
      return res
        .status(400)
        .json({ message: "El estado especificado no existe" });
    }

    const nuevaFicha = { NumeroFicha, Programa, Jornada, EstadoId, UsuarioId: UsuarioId, };

    const fichaCreada = await Ficha.create(nuevaFicha);

    res.status(200).json(fichaCreada);
  } catch (error) {
    console.error("Error al crear la ficha", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllFichas = async (req, res) => {
  try {
    let Fichas = await Ficha.findAll({
      attributes: null,
      include: [
        {
          model: Usuario,
          atributes: ["nombre"],
        },
        {
          model: Estado,
          attributes: ["estadoName"],
        },
      ],
    });

    res.status(200).json(Fichas);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getFicha = async (req, res) => {
  try {
    let Fichas = await Ficha.findByPk(req.params.id);

    if (!Fichas) {
      return res.status(404).json({ mensaje: "No se encontró la ficha" });
    }

    res.status(200).json(Fichas);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateFicha = async (req, res) => {
  try {
    const { id } = req.params;
    const { EstadoId, NumeroFicha, Programa, Jornada } = req.body;
    const UsuarioId = req.usuario.id;

    const ficha = await Ficha.findByPk(id);
    if (!ficha) {
      return res.status(404).json({ message: "No se encontró ninguna ficha" });
    }

    if (NumeroFicha) {
      const consultaId = await Ficha.findOne({
        where: {
          NumeroFicha,
          id: { [Op.ne]: ficha.id },
        },
      });
      if (consultaId) {
        return res
          .status(400)
          .json({ message: "La ficha con el mismo NumeroFicha ya existe" });
      }
      ficha.NumeroFicha = NumeroFicha;
    }

    if (EstadoId) {
      const consultaEstado = await Estado.findByPk(EstadoId);
      if (!consultaEstado) {
        return res
          .status(400)
          .json({ message: "El estado especificado no existe" });
      }
      ficha.EstadoId = EstadoId;
    }
    ficha.UsuarioId = UsuarioId;

    if (Programa !== undefined) {
      ficha.Programa = Programa;
    }
    if (Jornada !== undefined) {
      ficha.Jornada = Jornada;
    }

    await ficha.save();

    res.status(200).json(ficha);
  } catch (error) {
    console.error("Error al actualizar la ficha", error);
    res.status(500).json({ message: error.message });
  }
}