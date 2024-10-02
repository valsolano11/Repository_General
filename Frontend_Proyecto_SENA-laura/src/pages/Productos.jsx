import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import EditProductModal from "../components/EditProductModal";
import AddProductModal from "../components/AddProductModal";
import EditCantidadEntradaModal from "../components/EditCantidadEntradaModal"; 
import "react-toastify/dist/ReactToastify.css";

const Productos = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenEditCantidadEntradaModal, setIsOpenEditCantidadEntradaModal] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data
      const response = [
        {
          id: 1,
          UsuarioId: 101,
          marca: "Marca A",
          cantidad_actual: 50,
          cantidad_entrada: 10,
          descripcion: "Descripción del producto A",
          unidadmedidaId: 5,
          subcategoriaId: 3,
          estadoId: 2,
          cantidad_salida: 5,
          nombre: "Producto A",
          codigo: "COD123",
        },
        {
            id: 1,
            UsuarioId: 101,
            marca: "Marca A",
            cantidad_actual: 50,
            cantidad_entrada: 10,
            descripcion: "Descripción del producto A",
            unidadmedidaId: 5,
            subcategoriaId: 3,
            estadoId: 2,
            cantidad_salida: 5,
            nombre: "Producto A",
            codigo: "COD123",
          },
      ];

      setData(response);
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Error al cargar los datos de productos", {
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
    const product = data[rowIndex];
    setSelectedProduct(product);
    setIsOpenEditModal(true);
  };

  const handleEditCantidadEntradaClick = (rowIndex) => {
    const product = data[rowIndex];
    setSelectedProduct(product);
    setIsOpenEditCantidadEntradaModal(true);
  };

  const handleCloseEditModal = (updatedProduct) => {
    if (updatedProduct) {
      fetchData();
    }
    setIsOpenEditModal(false);
    setSelectedProduct(null);
  };

  const handleCloseEditCantidadEntradaModal = (updatedProduct) => {
    if (updatedProduct) {
      fetchData();
    }
    setIsOpenEditCantidadEntradaModal(false);
    setSelectedProduct(null);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = (newProduct) => {
    if (newProduct) {
      fetchData();
    }
    setIsOpenAddModal(false);
  };

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "UsuarioId",
      label: "USUARIO",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "marca",
      label: "MARCA",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "cantidad_actual",
      label: "CANTIDAD ACTUAL",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "cantidad_entrada",
      label: "CANTIDAD DE ENTRADA",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value, tableMeta) => (
          <div className="flex items-center justify-center">
            <span>{value}</span>
            <IconButton
              onClick={() => handleEditCantidadEntradaClick(tableMeta.rowIndex)}
              color="primary"
              aria-label="edit cantidad entrada"
              size="small"
            >
              <EditIcon />
            </IconButton>
          </div>
        ),
      },
    },
    {
      name: "descripcion",
      label: "DESCRIPCIÓN",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "unidadmedidaId",
      label: "UNIDAD DE MEDIDA",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "subcategoriaId",
      label: "SUBCATEGORIA",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "estadoId",
      label: "ESTADO",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "cantidad_salida",
      label: "CANTIDAD DE SALIDA",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "nombre",
      label: "NOMBRE",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "codigo",
      label: "CODIGO",
      options: {
        customHeadRender: (columnMeta) => (
          <th 
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
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
            className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}
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
      id: row.data[0],
      UsuarioId: row.data[1],
      Marca: row.data[2],
      CantidadActual: row.data[3],
      CantidadEntrada: row.data[4],
      Descripcion: row.data[5],
      UnidadMedida: row.data[6],
      SubcategoriaId: row.data[7],
      CantidadSalida: row.data[9],
      Nombre: row.data[10],
      Codigo: row.data[11],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Productos.xlsx");
  };

  // Función para verificar permisos
  const hasPermission = (permissionName) => {
    return user.DetallePermisos.some(
      (permiso) => permiso.Permiso.nombrePermiso === permissionName
    );
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
          {hasPermission("Crear Producto") && (
            <button className="btn-primary" onClick={handleOpenAddModal}>
              Agregar Producto
            </button>
          )}
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-9xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando productos...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">PRODUCTOS</span>}
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
      {selectedProduct && (
        <EditProductModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModal}
          product={selectedProduct}
        />
      )}
      {selectedProduct && (
        <EditCantidadEntradaModal
          isOpen={isOpenEditCantidadEntradaModal}
          onClose={handleCloseEditCantidadEntradaModal}
          product={selectedProduct}
        />
      )}
      <AddProductModal isOpen={isOpenAddModal} onClose={handleCloseAddModal} />
    </div>
  );
};

export default Productos;
