import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Sidebar from "../components/Sidebar";
import SidebarCoord from "../components/SidebarCoord";
import Home from "../components/Home";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../api/token";

const Historial = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(""); // Estado para el rol del usuario

  // Función para obtener el rol del usuario
  const fetchUserRole = async () => {
    try {
      // Suponiendo que tienes un endpoint para obtener el rol del usuario logueado
      const response = await api.get("/Rol"); // Ajusta el endpoint a tu lógica
      setUserRole(response.data.role); // Asume que el rol está en `data.role`
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      toast.error("Error al obtener el rol del usuario", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Función para obtener los datos del historial
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/historial"); // Aquí llamas al endpoint real
      setData(response.data);
    } catch (error) {
      console.error("Error fetching historial data:", error);
      toast.error("Error al cargar los datos del historial", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setLoading(false);
  };

  // Llama a las funciones para obtener el rol y el historial
  useEffect(() => {
    fetchUserRole(); // Llama a la función para obtener el rol
    fetchData(); // Llama a la función para obtener el historial
  }, []);

  const columns = [
    {
      name: "tipoAccion",
      label: "TIPO DE EVENTO",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
      },
    },
    {
      name: "Usuario",
      label: "USUARIO",
      options: {
        customBodyRender: (value) => (
          <div className="text-center">{value?.nombre ? value.nombre : "N/A"}</div>
        ),
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
      },
    },    
    {
      name: "createdAt",
      label: "FECHA",
      options: {
        customBodyRender: (value) => <div className="text-center">{new Date(value).toLocaleString()}</div>,
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
      },
    },
    {
      name: "descripcion",
      label: "DESCRIPCIÓN",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">
            {columnMeta.label}
          </th>
        ),
        setCellProps: () => ({
          className: "custom-table-cell",
          style: { padding: "12px", fontSize: "14px" },
        }),
      },
    },
  ];
  

  return (
    <div className="flex min-h-screen">
      {/* Condición para cargar SidebarCoord si el rol es "coordinador", o Sidebar para otros roles */}
      {userRole === "coordinador" ? (
        <SidebarCoord sidebarToggle={sidebarToggle} userRole={userRole} />
      ) : (
        <Sidebar sidebarToggle={sidebarToggle} userRole={userRole} />
      )}
      <div
        className={`flex flex-col flex-grow p-6 bg-gray-100 ${
          sidebarToggle ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <div className="flex justify-start mt-2">
          <button className="btn-primary" onClick={() => window.history.back()}>
            Volver Atrás
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="w-auto">
            {loading ? (
              <div className="text-center">Cargando historial...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">HISTORIAL</span>}
                data={data}
                columns={columns}
                options={{
                  responsive: "standard",
                  selectableRows: "none",
                  download: true,
                  print: true,
                  viewColumns: true,
                  filter: true,
                  search: true,
                  rowsPerPage: 5,
                  rowsPerPageOptions: [5, 10, 15],
                  setTableProps: () => ({
                    className: "custom-tables",
                  }),
                  textLabels: {
                    body: {
                      noMatch: "No se encontraron registros",
                      toolTip: "Ordenar",
                    },
                    pagination: {
                      next: "Siguiente Página",
                      previous: "Página Anterior",
                      rowsPerPage: "Filas por página:",
                      displayRows: "de",
                    },
                    toolbar: {
                      search: "Buscar",
                      downloadCsv: "Descargar CSV",
                      print: "Imprimir",
                      viewColumns: "Ver Columnas",
                      filterTable: "Filtrar Tabla",
                    },
                    filter: {
                      all: "Todo",
                      title: "FILTROS",
                      reset: "REINICIAR",
                    },
                    viewColumns: {
                      title: "Mostrar Columnas",
                      titleAria: "Mostrar/Ocultar Columnas",
                    },
                    selectedRows: {
                      text: "fila(s) seleccionada(s)",
                      delete: "Borrar",
                      deleteAria: "Borrar filas seleccionadas",
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;
