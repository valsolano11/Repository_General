import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 
import "react-toastify/dist/ReactToastify.css";

const EditHerramientaModal = ({ isOpen, onClose, herramienta }) => {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    fechaIngreso: "",
    marca: "",
    estadoId: "",
    categoriaId: "",
    descripcion: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && herramienta) {
      fetchHerramientaDetails(herramienta.id);
    }
  }, [isOpen, herramienta]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/categorias");
        setCategorias(response.data);
      } catch (error) {
        toast.error("Error al cargar categorías", { position: "top-right" });
      }
    };

    const fetchEstados = async () => {
      try {
        const response = await api.get("/estados");
        setEstados(response.data);
      } catch (error) {
        toast.error("Error al cargar los estados", { position: "top-right" });
      }
    };

    fetchCategorias();
    fetchEstados();
  }, []);

  const fetchHerramientaDetails = async (herramientaId) => {
    setLoading(true);
    try {
      const response = await api.get(`/herramientas/${herramientaId}`);
      if (response.status === 200) {
        const { codigo, nombre, fechaIngreso, marca, estadoId, categoriaId, descripcion } = response.data;
        setFormData({
          codigo: codigo || "",
          nombre: nombre || "",
          fechaIngreso: fechaIngreso || "",
          marca: marca || "",
          estadoId: estadoId || "",
          categoriaId: categoriaId || "",
          descripcion: descripcion || "",
        });
        setLoading(false);
      } else {
        console.error("Error fetching herramienta details:", response.data.message);
        toast.error("Error al cargar la información de la herramienta.", {
          position: "top-right",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching herramienta details:", error);
      toast.error("Error al cargar la información de la herramienta.", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "codigo" && !value) {
      errorMessage = "El código es obligatorio.";
    } else if (name === "nombre") {
      const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!nameRegex.test(value) || /\d/.test(value)) {
        errorMessage = "El nombre no puede contener números o caracteres especiales.";
      }
    } else if (name === "fechaIngreso" && !Date.parse(value)) {
      errorMessage = "La fecha debe ser válida.";
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

  const handleUpdate = async () => {
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
      toast.error("Por favor, corrige los errores antes de actualizar.", {
        position: "top-right",
      });
      return;
    }

    if (!codigo || !nombre || !fechaIngreso || !marca || !estadoId || !categoriaId) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/herramientas/${herramienta.id}`,
        {
          codigo,
          nombre,
          fechaIngreso,
          marca,
          estadoId,
          categoriaId,
          descripcion,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Herramienta actualizada exitosamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          onClose(response.data);
        }, 2000);
      } else {
        console.error("Error updating herramienta profile:", response.data.message);
        toast.error("Error al actualizar la información de la herramienta.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating herramienta profile:", error);
      if (error.response && error.response.status === 401) {
        setTimeout(() => {
          navigate("/");
        });
      } else {
        toast.error("Error al actualizar la información de la herramienta.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar permisos
  const hasPermission = (permissionName) => {
    return user.DetallePermisos.some(
      (permiso) => permiso.Permiso.nombrePermiso === permissionName
    );
  };  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50">
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
                  Editar Herramienta
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
                  <label className="mb-1 font-bold text-sm">Estado *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="estadoId"
                    value={formData.estadoId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Estado</option>
                    {estados.map((estado) => (
                      <option
                        key={estado.id}
                        value={estado.id}
                        style={{
                          color:
                            estado.estadoName === "ACTIVO"
                              ? "green"
                              : estado.estadoName === "INACTIVO"
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {estado.estadoName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Categoría *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
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
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-full md:w-full flex flex-col justify-end">
          {hasPermission("Modificar Herramienta") && (
            <div className="flex justify-center mb-4 mx-2">
              <button className="btn-danger2 mx-2" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn-primary2 mx-2" onClick={handleUpdate}>
                Actualizar
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditHerramientaModal;
