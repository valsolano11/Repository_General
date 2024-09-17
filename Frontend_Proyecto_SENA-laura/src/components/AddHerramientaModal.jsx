import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddHerramientaModal = ({ isOpen, onClose, herramienta }) => {
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    fechaIngreso: "",
    marca: "",
    estadoId: "",
    categoriaId: "",
    descripcion: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (herramienta) {
      setFormData({
        codigo: herramienta.codigo || "",
        nombre: herramienta.nombre || "",
        fechaIngreso: herramienta.fechaIngreso || "",
        marca: herramienta.marca || "",
        estadoId: herramienta.estadoId || "",
        categoriaId: herramienta.categoriaId || "",
        descripcion: herramienta.descripcion || "",
      });
    }
  }, [herramienta]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/categorias");
        setCategorias(response.data);
      } catch (error) {
        showToastError("Error al cargar categorías");
      }
    };

    const fetchEstados = async () => {
      try {
        const response = await api.get("/estados");
        setEstados(response.data);
      } catch (error) {
        showToastError("Error al cargar los estados");
      }
    };

    fetchCategorias();
    fetchEstados();
  }, []);

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "codigo" && !value) {
      errorMessage = "El código es obligatorio.";
    } else if (name === "nombre") {
      const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!nameRegex.test(value) || /\d/.test(value)) {
        errorMessage = "El nombre no puede contener números o caracteres especiales.";
      }
    } else if (name === "fechaIngreso") {
      if (!Date.parse(value)) {
        errorMessage = "La fecha debe ser válida.";
      }
    } else if (name === "marca" && !value) {
      errorMessage = "La marca es obligatoria.";
    }
    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateInput(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const showToastError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      nombre: "",
      fechaIngreso: "",
      marca: "",
      estadoId: "",
      categoriaId: "",
      descripcion: "",
    });
  };

  const handleCreate = async () => {
    const { codigo, nombre, fechaIngreso, marca, estadoId, categoriaId, descripcion } = formData;
    const codigoError = validateInput("codigo", codigo);
    const nombreError = validateInput("nombre", nombre);
    const fechaIngresoError = validateInput("fechaIngreso", fechaIngreso);
    const marcaError = validateInput("marca", marca);

    if (codigoError || nombreError || fechaIngresoError || marcaError) {
      setFormErrors({
        codigo: codigoError,
        nombre: nombreError,
        fechaIngreso: fechaIngresoError,
        marca: marcaError,
      });
      showToastError("Por favor, corrige los errores antes de agregar.");
      return;
    }

    if (!codigo || !nombre || !fechaIngreso || !marca || !estadoId || !categoriaId) {
      showToastError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post("/herramientas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Herramienta agregada exitosamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        resetForm();
        setTimeout(() => {}, 2000);
      } else {
        showToastError(
          "Ocurrió un error!, por favor intenta con un código o nombre diferente."
        );
      }
    } catch (error) {
      showToastError(
        "Ocurrió un error!, por favor intenta con un código o nombre diferente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <FaTimes className="text-black w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-center space-y-4 md:space-y-0 mb-4">
          <div className="w-full md:w-3/4">
            <div className="font-inter ml-2">
              <div className="space-y-2 md:space-y-2 text-left">
                <h6 className="font-bold text-center text-2xl mb-2">
                  Registro Herramienta
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Código *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                  />
                  {formErrors.codigo && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.codigo}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Nombre *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (/\d/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {formErrors.nombre && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.nombre}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Fecha de Ingreso *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="date"
                    name="fechaIngreso"
                    value={formData.fechaIngreso}
                    onChange={handleInputChange}
                  />
                  {formErrors.fechaIngreso && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.fechaIngreso}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Marca *</label>
                  <input
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                  />
                  {formErrors.marca && (
                    <div className="text-red-400 text-sm mt-1 px-2">
                      {formErrors.marca}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Categoría *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Estado *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="estadoId"
                    value={formData.estadoId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione un estado</option>
                    {estados.map((estado) => (
                      <option
                        key={estado.id}
                        value={estado.id}
                        style={{
                          color:
                            estado.nombre === "ACTIVO"
                              ? "green"
                              : estado.nombre === "INACTIVO"
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Descripción</label>
                  <textarea
                    className="bg-grisClaro text-sm rounded-lg px-2 h-24"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="sm:w-full md:w-full flex flex-col justify-end">
                  <div className="flex justify-center mt-4 mb-4 mx-2">
                    <button className="btn-danger2 mx-2" onClick={onClose}>
                      Cancelar
                    </button>
                    <button
                      className="btn-primary2 mx-2"
                      onClick={handleCreate}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddHerramientaModal;
