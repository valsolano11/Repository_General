import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom"; 
import MUIDataTable from "mui-datatables";
import { api } from "../api/token";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TablaPedidosFirma = () => {
  const { id } = useParams();
  const location = useLocation();
  const [pedido, setPedido] = useState(null);
  const { pedidoId } = location.state || {};
  const [pedidoData, setPedidoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    {
      ProductoId: "",
      nombre: "",
      UnidadMedidaId: "",
      cantidadSolicitar: "",
      observaciones: "",
    },
  ]);

  const fetchPedido  = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/pedido/${id}`);
      setPedido(response.data);
  
      const pedidosFormatted = data.map((pedido, index) => ({
        item: index + 1, 
        nombre: pedido.nombre,
        UnidadMedidaId: pedido.UnidadMedidaId,
        cantidadSolicitar: pedido.cantidadSolicitar,
        observaciones: pedido.observaciones,
      }));
  
      setData(pedidosFormatted);
      setData({
        item: index + 1, 
        nombre: pedido.nombre,
        UnidadMedidaId: pedido.UnidadMedidaId,
        cantidadSolicitar: pedido.cantidadSolicitar,
        observaciones: pedido.observaciones,
      })
    } catch (error) {
      console.error("Error fetching pedidos data:", error);
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
    fetchPedido ();
  }, [id]);

  const columns = [
    {
      name: "item",
      label: "ITEM",
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
      name: "nombre",
      label: "NOMBRE PRODUCTO",
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
      name: "UnidadMedidaId",
      label: "UNIDAD DE MEDIDA",
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
      name: "cantidadSolicitar",
      label: "CANTIDAD A SOLICITAR",
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
      name: "observaciones",
      label: "OBSERVACIONES",
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
  ];

  return (
    <div>
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-9xl mx-auto">
          <MUIDataTable
            data={data}
            columns={columns}
            options={{
              responsive: "standard",
              selectableRows: "none",
              download: false,
              print: false,
              viewColumns: false,
              filter: false,
              search: false,
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
        </div>
      </div>
    </div>
  );
};

export default TablaPedidosFirma;
