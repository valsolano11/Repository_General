import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/token";
import MUIDataTable from "mui-datatables";
import "react-toastify/dist/ReactToastify.css";

const TablaPrestamosGestion = ({ actualizarFechaEntrega }) => {
  const [herramientas, setHerramientas] = useState([]);
  const location = useLocation();
  const { prestamoId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchherramientas = async () => {
      try {
        const response = await api.get(`/herramienta`);
        setHerramientas(response.data);
      } catch (err) {
        console.error("Error fetching herramientas:", err);
        toast.error("Error al cargar herramientas.");
      }
    };

    fetchherramientas();
  }, []);

  useEffect(() => {
    const fetchherramientasDelPedido = async () => {
      if (!prestamoId) return;

      try {
        setLoading(true);
        const response = await api.get(`/prestamos/${prestamoId}`);
        const herramientasData = response.data.Herramienta || [];

        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const formattedDate = isNaN(date.getTime())
            ? "Sin fecha"
            : date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });
          return formattedDate;
        };

        const herramientasFormatted = herramientasData.map(
          (herramienta, index) => {
            const fechaEntrega = herramienta.fechaEntrega
              ? formatDate(herramienta.fechaEntrega)
              : "Sin fecha";

            return {
              item: index + 1,
              nombre: herramienta.nombre,
              codigo: herramienta.codigo,
              HerramientumId: herramienta.id,
              observaciones:
                herramienta.PrestamoHerramienta?.observaciones ||
                "Sin observaciones",
              fechaEntrega,
            };
          }
        );
        setData(herramientasFormatted);
      } catch (err) {
        console.error("Error fetching herramientas:", err);
        toast.error("Error al cargar herramientas.");
      } finally {
        setLoading(false);
      }
    };

    fetchherramientasDelPedido();
  }, [prestamoId]);

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
      label: "NOMBRE herramienta",
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
      name: "codigo",
      label: "CÓDIGO herramienta",
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
    {
      name: "fechaEntrega",
      label: "FECHA ENTREGA",
      options: {
        customHeadRender: (columnMeta) => (
          <th
            key={columnMeta.label}
            className="text-center bg-white text-black uppercase text-xs font-bold"
          >
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value) => {
          const displayValue = value || "Fecha pendiente";
          return <div className="text-center">{displayValue}</div>;
        },
      },
    },
  ];

  return (
    <div>
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-9xl mx-auto">
          {loading ? (
            <div>Cargando herramientas...</div>
          ) : (
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
  );
};

export default TablaPrestamosGestion;
