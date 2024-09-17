import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProductModal = ({ isOpen, onClose, product }) => {
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    marca: "",
    cantidad_actual: "",
    cantidad_entrada: "",
    descripcion: "",
    unidadmedidaId: "",
    subcategoriaId: "",
    estadoId: "",
    cantidad_salida: "",
    nombre: "",
    codigo: "",
  });
  useEffect(() => {
    if (isOpen && product) {
      fetchProductDetails(product.id);
    }
  }, [isOpen, product]);
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await api.get("/estados");
        setEstados(response.data);
      } catch (error) {
        toast.error("Error al cargar los estados", { position: "top-right" });
      }
    };
    const fetchMedidas = async () => {
      try {
        const response = await api.get("/medidas");
        setMedidas(response.data);
      } catch (error) {
        toast.error("Error al cargar las unidades de medida", {
          position: "top-right",
        });
      }
    };
    fetchEstados();
    fetchMedidas();
  }, []);
  const fetchProductDetails = async (productId) => {
    setLoading(true);
    try {
      const response = await api.get(`/productos/${productId}`);
      if (response.status === 200) {
        const {
          marca,
          cantidad_actual,
          cantidad_entrada,
          descripcion,
          UnidadmedidaId,
          subcategoriaId,
          EstadoId,
          cantidad_salida,
          nombre,
          codigo,
        } = response.data;
        setFormData({
          marca: marca || "",
          cantidad_actual: cantidad_actual || "",
          cantidad_entrada: cantidad_entrada || "",
          descripcion: descripcion || "",
          unidadmedidaId: UnidadmedidaId || "",
          subcategoriaId: subcategoriaId || "",
          estadoId: EstadoId || "",
          cantidad_salida: cantidad_salida || "",
          nombre: nombre || "",
          codigo: codigo || "",
        });
        setLoading(false);
      } else {
        console.error("Error fetching product details:", response.data.message);
        toast.error("Error al cargar la información del producto.", {
          position: "top-right",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Error al cargar la información del producto.", {
        position: "top-right",
      });
      setLoading(false);
    }
  };
  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "nombre" || name === "descripcion") {
      if (/[^a-zA-Z0-9\s]/.test(value)) {
        errorMessage = "El campo no puede contener caracteres especiales.";
      }
    } else if (name === "codigo") {
      if (!/^[A-Za-z0-9]+$/.test(value)) {
        errorMessage = "El código debe ser alfanumérico.";
      }
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
    const {
      marca,
      cantidad_actual,
      cantidad_entrada,
      descripcion,
      unidadmedidaId,
      subcategoriaId,
      estadoId,
      cantidad_salida,
      nombre,
      codigo,
    } = formData;
    if (
      !marca ||
      !cantidad_actual ||
      !cantidad_entrada ||
      !descripcion ||
      !unidadmedidaId ||
      !subcategoriaId ||
      !estadoId ||
      !cantidad_salida ||
      !nombre ||
      !codigo
    ) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-right",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await api.put(
        `/productos/${product.id}`,
        {
          marca,cantidad_actual, cantidad_entrada,
          descripcion,
          UnidadmedidaId: unidadmedidaId,
          subcategoriaId: subcategoriaId,
          EstadoId: estadoId,
          cantidad_salida,
          nombre,
          codigo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Producto actualizado exitosamente", {
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
        console.error("Error updating product:", response.data.message);
        toast.error("Error al actualizar la información del producto.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response && error.response.status === 401) {
        setTimeout(() => {
          navigate("/");
        });
      } else {
        toast.error("Error al actualizar la información del producto.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <FaTimes className="text-black w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center justify-center space-y-2 md:space-y-0 mb-2">
          <div className="w-full md:w-3/4">
            <div className="font-inter ml-1">
              <div className="space-y-1 md:space-y-1 text-left">
                <h6 className="font-bold text-center text-lg mb-1">
                  Editar Producto
                </h6>
                {loading ? (
                  <p className="text-center text-xs">Cargando información...</p>
                ) : (
                  <div className="space-y-1">
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">Marca *</label>
                      <input
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        type="text"
                        name="marca"
                        value={formData.marca}
                        onChange={handleInputChange}
                      />
                      {formErrors.marca && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.marca}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">
                        Cantidad Actual *
                      </label>
                      <input
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        type="number"
                        name="cantidad_actual"
                        value={formData.cantidad_actual}
                        onChange={handleInputChange}
                      />
                      {formErrors.cantidad_actual && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.cantidad_actual}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">
                        Cantidad de Entrada *
                      </label>
                      <input
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        type="number"
                        name="cantidad_entrada"
                        value={formData.cantidad_entrada}
                        onChange={handleInputChange}
                      />
                      {formErrors.cantidad_entrada && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.cantidad_entrada}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">
                        Descripción *
                      </label>
                      <input
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        type="text"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                      />
                      {formErrors.descripcion && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.descripcion}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">
                        Unidad de Medida *
                      </label>
                      <select
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        name="unidadmedidaId"
                        value={formData.unidadmedidaId}
                        onChange={handleInputChange}
                      >
                        <option value="">Seleccionar</option>
                        {medidas.map((medida) => (
                          <option key={medida.id} value={medida.id}>
                            {medida.nombre}
                          </option>
                        ))}
                      </select>
                      {formErrors.unidadmedidaId && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.unidadmedidaId}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">
                        Subcategoría *
                      </label>
                      <input
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        type="number"
                        name="subcategoriaId"
                        value={formData.subcategoriaId}
                        onChange={handleInputChange}
                      />
                      {formErrors.subcategoriaId && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.subcategoriaId}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">Estado *</label>
                      <select
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        name="estadoId"
                        value={formData.estadoId}
                        onChange={handleInputChange}
                      >
                        <option value="">Seleccionar</option>
                        {estados.map((estado) => (
                          <option key={estado.id} value={estado.id}>
                            {estado.nombre}
                          </option>
                        ))}
                      </select>
                      {formErrors.estadoId && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.estadoId}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">
                        Cantidad de Salida *
                      </label>
                      <input
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        type="number"
                        name="cantidad_salida"
                        value={formData.cantidad_salida}
                        onChange={handleInputChange}
                      />
                      {formErrors.cantidad_salida && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.cantidad_salida}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">Nombre *</label>
                      <input
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                      />
                      {formErrors.nombre && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.nombre}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-0.5 font-bold text-xs">Código *</label>
                      <input
                        className="bg-grisClaro text-xs rounded-lg px-1 py-1"
                        type="text"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleInputChange}
                      />
                      {formErrors.codigo && (
                        <div className="text-red-400 text-xs mt-0.5">
                          {formErrors.codigo}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-full md:w-full flex flex-col justify-end">
          <div className="flex justify-center mb-2 mx-1">
            <button className="btn-danger2 mx-1 text-xs" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-primary2 mx-1 text-xs" onClick={handleUpdate}>
              Actualizar
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default EditProductModal;