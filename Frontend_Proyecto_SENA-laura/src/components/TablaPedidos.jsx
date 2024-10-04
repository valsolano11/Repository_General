import React, { useState } from "react";
import { api } from "../api/token";

const TablaPedidos = ({ accordionStates, toggleAccordion }) => {
  const [formErrors, setFormErrors] = useState({});
  const [productos, setProductos] = useState([
    {
      nombre: "",
      UnidadDeMedida: "",
      cantidadSolicitar: "",
      observaciones: "",
    },
  ]);

  const [sugerenciasProductos, setSugerenciasProductos] = useState({});

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newProductos = [...productos];
    newProductos[index][name] = value;
    setProductos(newProductos);

    // Si el campo es 'nombre', ejecutamos la búsqueda de sugerencias
    if (name === "nombre") {
      buscarSugerenciasProducto(index, value);
    }
  };

  const addRow = () => {
    setProductos([
      ...productos,
      {
        nombre: "",
        UnidadDeMedida: "",
        cantidadSolicitar: "",
        observaciones: "",
      },
    ]);
  };

  const buscarSugerenciasProducto = async (index, query) => {
    if (query.length > 2) {
      try {
        const response = await api.get(`/producto/busqueda?query=${query}`);

        console.log("Response data:", response.data);

        if (Array.isArray(response.data)) {
          const productosConUnidad = response.data.map((producto) => ({
            ...producto,
            UnidadDeMedida: producto.UnidadDeMedida?.sigla || "", 
          }));

          setSugerenciasProductos((prev) => ({
            ...prev,
            [index]: productosConUnidad,
          }));
          console.log("Sugerencias actualizadas:", productosConUnidad);
        } else {
          setSugerenciasProductos((prev) => ({
            ...prev,
            [index]: [], 
          }));
        }
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setSugerenciasProductos((prev) => ({
          ...prev,
          [index]: [], 
        }));
      }
    } else {
      setSugerenciasProductos((prev) => ({
        ...prev,
        [index]: [], 
      }));
    }
  };

  const handleSelectSuggestion = (index, value, unidadDeMedida) => {
    const newProductos = [...productos];
    newProductos[index].nombre = value;
    newProductos[index].UnidadDeMedida = unidadDeMedida; 
    setProductos(newProductos);
    setSugerenciasProductos((prev) => ({
      ...prev,
      [index]: [], 
    }));
  };

  return (
    <div>
      {accordionStates.productos && (
        <div className="flex flex-col rounded-lg w-auto">
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-black text-xs">
              <thead>
                <tr>
                  <th className="border border-black px-2">ITEM</th>
                  <th className="border border-black px-2">NOMBRE DEL PRODUCTO</th>
                  <th className="border border-black px-2">UNIDAD DE MEDIDA</th>
                  <th className="border border-black px-2">CANTIDAD A SOLICITAR</th>
                  <th className="border border-black px-2">OBSERVACIONES</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td className="border border-black px-4 py-2">
                      {index + 1}
                    </td>

                    <td className="border border-black px-4 py-2 relative">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="nombre"
                        value={producto.nombre}
                        onChange={(event) => handleInputChange(index, event)}
                      />

                      {Array.isArray(sugerenciasProductos[index]) && sugerenciasProductos[index].length > 0 && (
                        <div className="absolute bg-white border border-gray-300 w-full max-h-40 overflow-y-auto z-10">
                          {sugerenciasProductos[index].map((sugerencia, i) => (
                            <div
                              key={i}
                              className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                              onClick={() => handleSelectSuggestion(index, sugerencia.nombre, sugerencia.UnidadDeMedida)} // Pasar unidad de medida
                            >
                              {sugerencia.nombre}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* UNIDAD DE MEDIDA */}
                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="UnidadDeMedida"
                        value={producto.UnidadDeMedida}
                        readOnly 
                      />
                    </td>

                    {/* CANTIDAD A SOLICITAR */}
                    <td className="border border-black px-4 py-2">
                      <input
                        type="number"
                        className="w-full px-2 py-1 rounded"
                        name="cantidadSolicitar"
                        value={producto.cantidadSolicitar}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>

                    {/* OBSERVACIONES */}
                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="observaciones"
                        value={producto.observaciones}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-2">
            <button className="btn-black2" onClick={addRow}>
              Agregar item
            </button>
            <button className="btn-black2 mb-4" onClick={() => handleCreate("productos")}>
              Guardar y continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaPedidos;