import express from "express";
import { asignarInstructorAFichas } from "../controllers/Formacion/Relacion.controllers.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";

const Relacion = express.Router();


Relacion.post("/asignar-fichas",rutaProtegida, asignarInstructorAFichas);

export default Relacion;
