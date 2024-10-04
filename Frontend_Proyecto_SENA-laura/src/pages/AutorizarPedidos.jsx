import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import SidebarCoord from "../components/SidebarCoord";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as XLSX from "xlsx";
import clsx from "clsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AutorizarPedidos = () => {
  const [sidebarToggleCoord, setsidebarToggleCoord] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([
    {
      createdAt: "",
      servidorAsignado: "",
      codigoFicha: "",
      area: "",
      EstadoId: "",
    },
  ]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await api.get("/pedidos"); 
        setPedidos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
        toast.error("Error al cargar los pedidos.", { position: "top-right" });
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get("/Estado");
        const filteredEstados = response.data.filter(
          (estado) => estado.id === 5 || estado.id === 6 || estado.id === 7
        );
        setEstados(filteredEstados);
      } catch (error) {
        showToastError("Error al cargar los estados");
      }
    };

    fetchStates();
  }, []);

  const handleViewClick = (rowIndex) => {
    // const Pedido = data[rowIndex];
    // setSelectedPedido(Pedido);
    navigate("/FirmaPedidos");
  };

  const columns = [
    {
      name: "createdAt",
      label: "FECHA",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "servidorAsignado",
      label: "NOMBRE SOLICITANTE",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "codigoFicha",
      label: "FICHA",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "area",
      label: "ÁREA",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "estadoName",
      label: "ESTADO",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => (
          <div
            className={clsx("text-center", {
              "text-green-500": value === "ENTREGADO",
              "text-orange-500": value === "EN PROCESO",
              "text-red-500": value === "PENDIENTE",
            })}
          >
            {value}
          </div>
        ),
        setCellHeaderProps: () => ({ style: { textAlign: "center" } }),
      },
    },
    {
      name: "ver",
      label: "VER DETALLE",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => (
          <div className="flex items-center justify-center">
            <IconButton
              onClick={() => handleViewClick(tableMeta.rowIndex)}
              color="primary"
              aria-label="view"
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        ),
      },
    },
  ];

  const handleCustomExport = (rows) => {
    const exportData = rows.map((row) => ({
      Código: row.data[0],
      Nombre: row.data[1],
      "Fecha de Ingreso": row.data[2],
      Marca: row.data[3],
      Condición: row.data[4],
      Descripción: row.data[5],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Pedidos.xlsx");
  };

  return (
    <div className="flex min-h-screen bg-fondo">
      <SidebarCoord sidebarToggleCoord={sidebarToggleCoord} />
      <div
        className={`flex flex-col flex-grow p-4 bg-fondo ${
          sidebarToggleCoord ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggleCoord}
          setSidebarToggle={setsidebarToggleCoord}
        />
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando Pedidos...</div>
            ) : (
              <MUIDataTable
                title={
                  <span className="custom-title">
                    Pedidos de Productos consumibles
                  </span>
                }
                data={data}
                columns={columns}
                options={{
                  responsive: "standard",
                  selectableRows: "none",
                  download: true,
                  rowsPerPage: 5,
                  rowsPerPageOptions: [5, 10, 15],
                  setTableProps: () => {
                    return {
                      className: "custom-tables",
                    };
                  },
                  onDownload: (buildHead, buildBody, columns, data) => {
                    handleCustomExport(data);
                    return false;
                  },
                  textLabels: {
                    body: {
                      noMatch: "Lo siento, no se encontraron registros",
                      toolTip: "Ordenar",
                    },
                    pagination: {
                      next: "Siguiente",
                      previous: "Anterior",
                      rowsPerPage: "Filas por página",
                      displayRows: "de",
                    },
                    toolbar: {
                      search: "Buscar",
                      downloadCsv: "Descargar CSV",
                      print: "Imprimir",
                      viewColumns: "Mostrar columnas",
                      filterTable: "Filtrar tabla",
                    },
                    filter: {
                      all: "Todos",
                      title: "FILTROS",
                      reset: "REINICIAR",
                    },
                    viewColumns: {
                      title: "Mostrar columnas",
                      titleAria: "Mostrar/Ocultar Columnas",
                    },
                    selectedRows: {
                      text: "fila(s) seleccionada(s)",
                      delete: "Eliminar",
                      deleteAria: "Eliminar fila seleccionada",
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center text-red700 mx-20">
          <p>
            NOTA: Los pedidos que no se firmen, es decir, que permanezcan en
            estado PENDIENTE. Tienen 3 días desde la fecha de creación para que
            cambien de estado a EN PROCESO, de lo contrario serán descartados.
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AutorizarPedidos;
