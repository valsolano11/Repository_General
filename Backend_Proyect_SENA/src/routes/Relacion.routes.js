import express from "express";
import { asignarInstructorAFichas } from "../controllers/Formacion/Relacion.controllers.js";

const Relacion = express.Router();

Relacion.post("/asignar-fichas", asignarInstructorAFichas);

export default Relacion;
