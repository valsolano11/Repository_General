import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

const Reportes = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const reportes = [
    {
      id: 1,
      nombre: "Productos solicitados por fichas",
      excelUrl: "/descargar/excel/ventas",
      pdfUrl: "/descargar/pdf/ventas",
    },
    {
      id: 2,
      nombre: "Productos solicitados por instructor",
      excelUrl: "/descargar/excel/inventario",
      pdfUrl: "/descargar/pdf/inventario",
    },
    {
      id: 3,
      nombre: "Productos más solicitados",
      excelUrl: "/descargar/excel/clientes",
      pdfUrl: "/descargar/pdf/clientes",
    },
    {
        id: 4,
        nombre: "Herramientas más solicitadas",
        excelUrl: "/descargar/excel/clientes",
        pdfUrl: "/descargar/pdf/clientes",
    },
    {
        id: 5,
        nombre: "Productos agotados",
        excelUrl: "/descargar/excel/clientes",
        pdfUrl: "/descargar/pdf/clientes",
    },
    {
        id: 6,
        nombre: "Herramientas en mal estado",
        excelUrl: "/descargar/excel/clientes",
        pdfUrl: "/descargar/pdf/clientes",
    },
    {
        id: 7,
        nombre: "Pedidos por coordinador",
        excelUrl: "/descargar/excel/clientes",
        pdfUrl: "/descargar/pdf/clientes",
    },
    {
        id: 7,
        nombre: "Pedidos por coordinador",
        excelUrl: "/descargar/excel/clientes",
        pdfUrl: "/descargar/pdf/clientes",
    },
    {
        id: 8,
        nombre: "Productos que ingresan por primera vez",
        excelUrl: "/descargar/excel/clientes",
        pdfUrl: "/descargar/pdf/clientes",
    },
  ];

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
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-6xl mx-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                      Nombre del Reporte
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                      Descargar Excel
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                      Descargar PDF
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportes.map((reporte) => (
                    <tr key={reporte.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {reporte.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={reporte.excelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sena hover:text-primaryDark"
                        >
                          <FaFileExcel className="text-center w-6 h-6" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={reporte.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaFilePdf className="text-center w-6 h-6" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
