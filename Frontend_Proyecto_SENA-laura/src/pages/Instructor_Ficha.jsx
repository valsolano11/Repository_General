import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditFichasModal from "../components/EditFichasModal";
import AddFichasModal from "../components/AddFichasModal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Intructor_Ficha = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedInstructorFicha, setSelectedInstructorFicha] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/obtener-relaciones", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const fichaInstructor = response.data.map((relacion) => ({
        ...relacion,
        nombreUsuario: relacion.Usuario
          ? relacion.Usuario.nombre
          : "Desconocido",
        NumeroFicha: relacion.Ficha
          ? relacion.Ficha.NumeroFicha
          : "Desconocido",
        Programa: relacion.Ficha ? relacion.Ficha.Programa : "Desconocido",
        Jornada: relacion.Ficha ? relacion.Ficha.Jornada : "Desconocido",
        InstructorNombre: relacion.Instructore
          ? relacion.Instructore.nombre
          : "Desconocido",
      }));

      fichaInstructor.sort((a, b) => a.id - b.id);
      setData(fichaInstructor);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error al cargar los datos de las fichas", {
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
    const ficha = data[rowIndex];
    setSelectedInstructorFicha(ficha);
    setIsOpenEditModal(true);
  };

  const handleCloseAddModalFichas = (newFichaInstructor) => {
    if (newFichaInstructor) {
      fetchData();
    }
    setSelectedInstructorFicha(null);
    setIsOpenAddModal(false);
  };

  const handleCloseEditModalFichas = (updatedFichaInstructor) => {
    if (updatedFichaInstructor) {
      fetchData();
    }
    setSelectedInstructorFicha(null);
    setIsOpenEditModal(false);
  };

  const columns = [
    {
      name: "id",
      label: "ID",
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
      name: "NumeroFicha",
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
      name: "Programa",
      label: "PROGRAMA",
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
      name: "Jornada",
      label: "JORNADA",
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
      name: "semestre",
      label: "SEMESTRE",
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
      name: "InstructorNombre",
      label: "INSTRUCTOR",
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
      name: "nombreUsuario",
      label: "USUARIO",
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
      name: "edit",
      label: "EDITAR",
      options: {
        filter: false,
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta) => (
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
      NumeroFicha: row.data[1],
      Instructor: row.data[2],
      Trimestre: row.data[3],
      InstructorNombre: row.data[4],
      nombreUsuario: row.data[5],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trismestre");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Fichas_Instructor.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "NumeroFicha",
      "Programa",
      "Jornada",
      "InstructorNombre",
      "nombreUsuario",
    ];
    const tableRows = [];
  
    data.forEach((rowData) => {
      const row = [
        rowData.NumeroFicha || "",
        rowData.Programa || "",
        rowData.Jornada || "",
        rowData.InstructorNombre || "",
        rowData.nombreUsuario || "",
      ];
      tableRows.push(row);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 57, 107] },
      margin: { top: 10 },
    });
  
    doc.text("Ficha_Instructor", 14, 15);
    doc.save("Ficha_Instructor.pdf");
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
            <button className="btn-black mr-2" onClick={handleExportPDF}>
            Exportar PDF
            </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-7xl overflow-auto">
            {loading ? (
              <div className="text-center">Cargando Trimestre...</div>
            ) : (
              <MUIDataTable
                title={
                  <span className="custom-title">FICHA POR INSTRUCTOR</span>
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
      </div>
      {selectedInstructorFicha && (
        <EditFichasModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModalFichas}
          realacion={selectedInstructorFicha}
        />
      )}
      <AddFichasModal
        isOpen={isOpenAddModal}
        onClose={handleCloseAddModalFichas}
      />
    </div>
  );
};
export default Intructor_Ficha;
