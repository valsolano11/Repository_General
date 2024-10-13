import React, { useState } from "react";
import { api } from "../api/token";

const TablaPedidos = ({ accordionStates, handleProductChange, productos }) => {
  const [sugerenciasProductos, setSugerenciasProductos] = useState({});

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = [...productos];
    updatedProducts[index][name] = value; // Actualizar el producto específico
    handleProductChange(updatedProducts); // Pasar los productos actualizados al padre

    if (name === "nombre") {
      buscarSugerenciasProducto(index, value);
    }
  };
  

  const addRow = () => {
    const newProduct = {
      ProductoId: "",
      nombre: "",
      cantidadSolicitar: "",
      observaciones: "",
    };
    
    // Crear un nuevo array con el nuevo producto agregado
    const updatedProducts = [...productos, newProduct];
    console.log("Productos antes de agregar:", productos);
    console.log("Productos después de agregar:", updatedProducts);
    
    // Pasar el nuevo array al padre
    handleProductChange(updatedProducts);
  };

  const removeRow = (index) => {
    const updatedProducts = productos.filter((_, i) => i !== index);
    console.log("Productos antes de eliminar:", productos);
    console.log("Productos después de eliminar:", updatedProducts);
    
    handleProductChange(updatedProducts);
  };

  const buscarSugerenciasProducto = async (index, query) => {
    if (query.length > 2) {
      console.log("Buscando productos con el término:", query); // Aquí
      try {
        const response = await api.get(`/producto/busqueda?query=${query}`);
        if (Array.isArray(response.data)) {
          const productosConUnidad = response.data.map((producto) => ({
            ...producto,
          }));

          setSugerenciasProductos((prev) => ({
            ...prev,
            [index]: productosConUnidad,
          }));
        } else {
          setSugerenciasProductos((prev) => ({
            ...prev,
            [index]: [],
          }));
        }
      } catch (error) {
        console.error("Error al buscar :", error);
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

  const handleSelectSuggestion = (index, ProductoId, nombre) => { // Agrega 'nombre' como argumento
    const newProductos = [...productos];
    newProductos[index].ProductoId = ProductoId;  
    newProductos[index].nombre = nombre; // Usa el argumento 'nombre'
    handleProductChange(newProductos);
  
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
                  <th className="border border-black px-2">CANTIDAD A SOLICITAR</th>
                  <th className="border border-black px-2">OBSERVACIONES</th>
                  <th className="border border-black px-2">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                  <td className="border border-black px-4 py-2">{index + 1}</td>
                  <td className="border border-black px-4 py-2 relative">
                    <input
                      className="w-full px-2 py-1 rounded"
                      name="nombre"
                      value={producto.nombre || ""}  // Mostrar el nombre del producto, pero solo para visualización
                      onChange={(e) => handleInputChange(index, e)}
                    />
                    {Array.isArray(sugerenciasProductos[index]) && sugerenciasProductos[index].length > 0 && (
                      <div
                        className="absolute bg-white border border-gray-300 max-h-40 overflow-y-auto z-10"
                        style={{ width: '100%' }} // Establece el ancho de las sugerencias igual al ancho del input
                      >
                        {sugerenciasProductos[index].map((sugerencia, i) => (
                          <div
                            key={i}
                            className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelectSuggestion(index, sugerencia.id, sugerencia.nombre)}
                          >
                            {sugerencia.nombre} ({sugerencia.UnidadDeMedida})
                          </div>
                        ))}
                      </div>
                    )}
                  </td>


                    <td className="border border-black px-4 py-2">
                      <input
                        type="number"
                        className="w-full px-2 py-1 rounded"
                        name="cantidadSolicitar"
                        value={producto.cantidadSolicitar}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="observaciones"
                        value={producto.observaciones}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                    <td className="border border-black px-4 py-2">
                      <button className="btn-red" onClick={() => removeRow(index)}>
                        Eliminar
                      </button>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaPedidos;
