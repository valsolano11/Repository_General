import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import EditPedidoModal from "../components/EditPedidoModal";
import AddPedidoModal from "../components/AddPedidoModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Pedidos = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = [
        {
          FechaPedido: "",
          CantidadEntregada: "",
          IDUsuario: "",
          IDFicha: "",
          Id: "",
          CantidadSolicitada: "",
          Codigo: "",
          IDProducto: "",
          IDInstructor: "",
        },
      ];

      setData(response);
    } catch (error) {
      console.error("Error fetching loan data:", error);
      toast.error("Error al cargar los datos de pedidos", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (rowIndex) => {
    const pedido = data[rowIndex];
    setSelectedPedido(pedido);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = (updatedPedido) => {
    if (updatedPedido) {
      fetchData();
    }
    setIsOpenEditModal(false);
    setSelectedPedido(null);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = (newPedido) => {
    if (newPedido) {
      fetchData();
    }
    setIsOpenAddModal(false);
  };

  const columns = [
    {
      name: "FechaPedido",
      label: "FECHA DE PEDIDO",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "CantidadEntregada",
      label: "CANTIDAD ENTREGADA",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "IDUsuario",
      label: "USUARIO",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "IDFicha",
      label: "FICHA",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "Id",
      label: "ID",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "CantidadSolicitada",
      label: "CANTIDAD SOLICITADA",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "Codigo",
      label: "CÓDIGO",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "IDProducto",
      label: "PRODUCTO",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "IDInstructor",
      label: "INSTRUCTOR",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "edit",
      label: "EDITAR",
      options: {
        filter: false,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => (
          <div className="flex items-center justify-center">
            <IconButton
              onClick={() => handleEditClick(tableMeta.rowIndex)}
              color="primary"
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
          </div>
        ),
      },
    },
  ];

  const handleCustomExport = (rows) => {
    const exportData = rows.map((row) => ({
      FechaPedido: row.data[0],
      CantidadEntregada: row.data[1],
      IDUsuario: row.data[2],
      IDFicha: row.data[3],
      Id: row.data[4],
      CantidadSolicitada: row.data[5],
      Codigo: row.data[6],
      IDProducto: row.data[7],
      IDInstructor: row.data[8],
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
    <div className="flex min-h-screen">
      <Sidebar sidebarToggle={sidebarToggle} />
      <div
        className={`flex flex-col flex-grow p-6 bg-gray-100 ${
          sidebarToggle ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <div className="flex justify-end mt-2">
          <button className="btn-primary" onClick={handleOpenAddModal}>
            Agregar Pedido
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-9xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando pedidos...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">PEDIDOS</span>}
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
                  setTableProps: () => {
                    return {
                      className: "custom-table",
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
                      rowsPerPage: "Filas por página:",
                      displayRows: "de",
                    },
                    toolbar: {
                      search: "Buscar",
                      downloadCsv: "Descargar CSV",
                      print: "Imprimir",
                      viewColumns: "Mostrar Columnas",
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
                      delete: "Eliminar",
                      deleteAria: "Eliminar filas seleccionadas",
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
      {selectedPedido && (
        <EditPedidoModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModal}
          pedido={selectedPedido}
        />
      )}
      <AddPedidoModal isOpen={isOpenAddModal} onClose={handleCloseAddModal}/>
    </div>
  );
};

export default Pedidos;