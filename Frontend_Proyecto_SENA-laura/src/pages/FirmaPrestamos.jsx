import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import fondo from "/logoSena.png";
import siga from "/Siga.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FirmaPrestamosEntrega from "../components/FirmaPrestamoEntrega";
import TablaPrestamosFirma from "../components/TablaPrestamosFirma";
import SidebarCoord from "../components/SidebarCoord";
import Home from "../components/Home";
import jsPDF from "jspdf";
import "jspdf-autotable";

const FirmaPrestamos = () => {
  const [sidebarToggleCoord, setsidebarToggleCoord] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { herramientaId } = location.state || {};
  const [prestamoData, setPrestamoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firmaImagen, setFirmaImagen] = useState(null);
  const [dummyState, setDummyState] = useState(false);
  const [formData, setFormData] = useState({
    firmaPrestamos: "",
    servidorAsignado: "",
    codigoFicha: "",
    area: "",
    EstadoId: "",
    nombre: "",
    Documento: "",
    jefeOficina: "",
    cedulaJefeOficina: "",
    cedulaServidor: "",
    correo: "",
    codigoSena: "",
  });
  const [firmaAdjunta, setFirmaAdjunta] = useState(false);

  const handleFirmaChange = (isFirmaAdjunta, file) => {
    setFirmaAdjunta(isFirmaAdjunta);
    setFirmaImagen(file);
  };

  const [accordionStates, setAccordionStates] = useState({
    datos: false,
    productos: false,
    firmas: false,
  });

  const toggleAccordion = (section) => {
    setAccordionStates((prevStates) => ({
      ...prevStates,
      [section]: !prevStates[section],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (herramientaId) {
        try {
          const response = await api.get(`/prestamos/${herramientaId}`);
          const data = response.data;

          const prestamosFormatted = {
            id: data.id,
            createdAt: data.createdAt,
            firmaPrestamos: data.firmaPrestamos,
            codigoFicha: data.codigoFicha,
            jefeOficina: data.jefeOficina,
            cedulaJefeOficina: data.cedulaJefeOficina,
            servidorAsignado: data.servidorAsignado,
            cedulaServidor: data.cedulaServidor,
            correo: data.correo,
            EstadoId: data.EstadoId,
            Estado: data.Estado,
            Herramienta: data.Herramienta,
          };
          setPrestamoData(prestamosFormatted);
          setFormData({
            fecha: formatDateForInput(data.createdAt),
            codigoFicha: data.codigoFicha,
            area: data.area,
            jefeOficina: data.jefeOficina,
            cedulaJefeOficina: data.cedulaJefeOficina,
            servidorAsignado: data.servidorAsignado,
            cedulaServidor: data.cedulaServidor,
            correo: data.correo,
            Herramienta: data.Herramienta,
          });
        } catch (error) {
          console.error("Error fetching prétamo data:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [herramientaId]);

  useEffect(() => {
    if (prestamoData) {
      setDummyState((prev) => !prev);
    }
  }, [prestamoData]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!firmaAdjunta) {
      toast.error("Debe adjuntar una firma antes de enviar el préstamo.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firma", firmaImagen);

      setLoading(true);

      const response = await api.put(`/prestamos/${herramientaId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Préstamo enviado correctamente.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/autPrestamos");
      } else {
        toast.error("Error al enviar el préstamo.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error al enviar el préstamo:", error);
      toast.error("Error al enviar el préstamo.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const Navigate = () => {
    navigate("/autPrestamos");
  };

  const handleExportPDF = (prestamoData) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Detalle del Préstamo", 14, 16);

    doc.setFontSize(12); 
    doc.text(`Código de Ficha: ${prestamoData.codigoFicha}`, 14, 30);
    doc.text(`Jefe de Oficina: ${prestamoData.jefeOficina}`, 14, 40);
    doc.text(`Cédula del Jefe: ${prestamoData.cedulaJefeOficina}`, 14, 50);
    doc.text(`Servidor Asignado: ${prestamoData.servidorAsignado}`, 14, 60);
    doc.text(`Cédula del Servidor: ${prestamoData.cedulaServidor}`, 14, 70);
    doc.text(`Correo: ${prestamoData.correo}`, 14, 80);
    doc.text(`Estado: ${prestamoData.Estado?.estadoName || "Desconocido"}`, 14, 90);
    doc.text(
        `Fecha de creación: ${new Date(
          prestamoData.createdAt
        ).toLocaleDateString()}`,
        14,
        100
      );

      if (prestamoData.Herramienta && prestamoData.Herramienta.length > 0) {
        const Herramienta = prestamoData.Herramienta.map((herramienta) => [
          herramienta.nombre,
          herramienta.codigo,
          herramienta.marca,
          herramienta.condicion,
          herramienta.PrestamoHerramienta?.observaciones || "N/A",
        ]);
  
        doc.autoTable({
          head: [
            [
              "Herramienta",
              "Código",
              "Descripción",
              "Marca",
              "Condición",
              "Observaciones",
            ],
          ],
          body: Herramienta,
          startY: 110,
        });
      } else {
        doc.text("No hay Herramienta asociados a este préstamo.", 14, 110);
      }

    doc.save(`Prestamo_${prestamoData.codigoFicha}.pdf`);
  };

  const handleExportClickPDF = () => {
    if (prestamoData && prestamoData.codigoFicha) {
      handleExportPDF(prestamoData);
    } else {
      console.error("Los datos del préstamo no están disponibles");
    }
  };

  const handleExportExcel = (prestamoData) => {
    if (!prestamoData || !prestamoData.codigoFicha) {
      console.error("Los datos del préstamo no están disponibles");
      return;
    }
  
    const prestamoHeaders = [
      "Código de Ficha",
      "Jefe de Oficina",
      "Cédula del Jefe",
      "Servidor Asignado",
      "Cédula del Servidor",
      "Correo",
      "Estado",
      "Fecha de creación",
    ];
  
    const prestamoValues = [
      prestamoData.codigoFicha,
      prestamoData.jefeOficina,
      prestamoData.cedulaJefeOficina,
      prestamoData.servidorAsignado,
      prestamoData.cedulaServidor,
      prestamoData.correo,
      prestamoData.Estado?.estadoName || "Desconocido",
      new Date(prestamoData.createdAt).toLocaleDateString(),
    ];
  
    const herramientaHeaders = [
      "Herramienta",
      "Código",
      "Marca",
      "Condición",
      "Observaciones",
    ];
  
    const Herramienta =
      prestamoData.Herramienta?.map((herramienta) => [
        herramienta.nombre,
        herramienta.codigo,
        herramienta.marca,
        herramienta.condicion,
        herramienta.PrestamoHerramienta?.observaciones || "N/A",
      ]) || [];
  
    const finalData = [
      [...prestamoHeaders],
      [...prestamoValues],
      [], 
      [...herramientaHeaders],
      ...Herramienta,
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(finalData);
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Préstamo");
  
    XLSX.writeFile(workbook, `Prestamo_${prestamoData.codigoFicha}.xlsx`);
  };  

  return (
    <div className="flex min-h-screen bg-grisClaro">
      <SidebarCoord sidebarToggleCoord={sidebarToggleCoord} />
      <div
        className={`flex flex-col flex-grow p-4 bg-grisClaro ${
          sidebarToggleCoord ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggleCoord}
          setSidebarToggle={setsidebarToggleCoord}
        />
        <div className="flex flex-col justify-center md:flex-row h-screen bg-grisClaro">
          <div className="hidden md:flex items-star justify-center md:w-3/4 bg-grisClaro mx-4">
            <div className="w-full mt-10">
              <div className={"px-4 py-3 w-full"}>
                <div className="flex items-center justify-between text-sm w-auto">
                  <img
                    className="w-20 h-20 object-cover ml-2"
                    src={fondo}
                    alt="logoSena"
                  />
                  <div className="flex flex-col items-center">
                    <span className="text-black font-semibold hidden md:inline">
                      SERVICIO NACIONAL DE APRENDIZAJE SENA
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      GESTIÓN DE INFRAESTRUCTURA Y LOGÍSTICA
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      FORMATO DE SOLICITUD DE SALIDA DE BIENES PARA EL USO DE
                      LOS
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      CUENTADANTES QUE TIENEN VÍNCULO CON LA ENTIDAD
                    </span>
                  </div>
                  <img
                    className="flex justify-end w-auto h-14 object-cover ml-2"
                    src={siga}
                    alt="siga"
                  />
                  <div className="flex flex-col">
                    <span className="text-black font-semibold hidden md:inline">
                      SBHNo.:
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      Versión: 04
                    </span>
                    <span className="text-black font-semibold hidden md:inline">
                      Código: GIL-F-014
                    </span>
                  </div>
                </div>

                {/* DATOS FIJOS */}
                <div className={"px-2 py-2 w-full mt-6"}>
                  <div className="flex flex-col space-y-4 md:space-y-0 text-xs w-full">
                    <div className="w-full font-inter text-left">
                      <div className="space-y-1">
                        <div className="flex flex-col md:flex-row justify-between gap-x-4">
                          <div className="flex flex-row">
                            <label className="mb-1 font-bold text-xs mt-2">
                              Código Regional
                            </label>
                            <input
                              className="bg-grisClaro border-b border-black text-xs text-black w-6 px-2 h-8"
                              type="text"
                              name="name"
                              value="5"
                              readOnly
                            />
                          </div>

                          <div className="flex flex-row">
                            <label className="mb-1 font-bold text-xs mt-2">
                              Nombre Regional
                            </label>
                            <input
                              className="bg-grisClaro border-b border-black text-xs text-center text-black w-20 px-2 h-8"
                              type="text"
                              name="name"
                              value="Antioquia"
                              readOnly
                            />
                          </div>
                          <div className="flex flex-row">
                            <label className="mb-1 font-bold text-xs mt-2">
                              Código Centro de Costos
                            </label>
                            <input
                              className="bg-grisClaro border-b border-black text-xs text-center text-black w-20 px-2 h-8"
                              type="text"
                              name="name"
                              value="920510"
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between gap-x-4">
                          <div className="flex flex-row w-4/5">
                            <label className="mb-1 font-bold text-xs mt-2">
                              Nombre Centro de Costos
                            </label>
                            <input
                              className="bg-grisClaro border-b border-black text-xs text-center text-black w-80 px-2 h-8"
                              type="text"
                              name="name"
                              value="Centro Tecnólogico del Mobiliario"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DATOS */}
                <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mt-4 mb-4">
                  <button
                    onClick={() => toggleAccordion("datos")}
                    className="font-bold text-lg py-2 flex justify-between items-center w-full"
                  >
                    <span>Datos</span>
                    <ExpandMoreIcon className="mr-2" />
                  </button>

                  {accordionStates.datos && (
                    <div className="flex flex-col rounded-lg w-full">
                      <div className="flex flex-col md:flex-row justify-between gap-x-4">
                        <div className="flex flex-row min-w-[200px] w-full md:w-2/3">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Código de grupo o ficha de caracterización*
                          </label>
                          <input
                            className=" border-b border-black text-xs text-center h-8 w-20"
                            type="text"
                            name="codigoFicha"
                            value={formData.codigoFicha}
                            readOnly
                          />
                        </div>
                        <div className="flex flex-row min-w-[200px] w-full md:w-1/3">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Área*
                          </label>
                          <div className="flex flex-col">
                            <input
                              className=" border-b border-black text-xs text-center h-8 w-200"
                              type="text"
                              name="area"
                              value={formData.area}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between gap-x-4">
                        <div className="flex flex-row w-full md:w-3/4">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Nombre de jefe de oficina o coordinador de área:*
                          </label>
                          <div className="flex flex-col">
                            <input
                              className=" border-b border-black text-xs text-center px-2 h-8"
                              type="text"
                              name="jefeOficina"
                              value={formData.jefeOficina}
                              readOnly
                            />
                          </div>
                        </div>

                        <label className="mb-1 font-bold text-xs mt-2">
                          Cédula*
                        </label>
                        <input
                          className=" border-b border-black text-xs text-center h-8 w-20"
                          type="text"
                          name="cedulaJefeOficina"
                          value={formData.cedulaJefeOficina}
                          readOnly
                        />
                      </div>

                      <div className="flex flex-col md:flex-row justify-between gap-x-4 mb-4">
                        <div className="flex flex-row w-full md:w-3/4">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Nombre del servidor público a quien se le asignará
                            el bien*
                          </label>
                          <div className="flex flex-col">
                            <input
                              className=" border-b border-black text-xs text-center px-2 h-8"
                              type="text"
                              name="servidorAsignado"
                              value={formData.servidorAsignado}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="flex flex-row w-full md:w-1/4">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Cédula*
                          </label>
                          <input
                            className=" border-b border-black text-xs text-center h-8 w-20"
                            type="text"
                            name="cedulaServidor"
                            value={formData.cedulaServidor}
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-row w-full md:w-3/4 mb-2">
                          <label className="mb-1 font-bold text-xs mt-2">
                            Correo electrónico a quien se le asignará el bien*
                          </label>
                          <div className="flex flex-col">
                            <input
                              className=" border-b border-black text-xs text-center px-2 h-8"
                              type="text"
                              name="correo"
                              value={formData.correo}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* PRESTAMOS */}
                <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mb-4">
                  <button
                    onClick={() => toggleAccordion("productos")}
                    className="font-bold text-lg py-2 flex justify-between items-center w-full"
                  >
                    <span>Préstamos</span>
                    <ExpandMoreIcon className="mr-2" />
                  </button>

                  {accordionStates.productos && (
                    <div className="flex flex-col rounded-lg w-full">
                      <div className="flex flex-row justify-center w-full mb-4">
                        <TablaPrestamosFirma
                          herramientaId={herramientaId}
                          accordionStates={accordionStates}
                          toggleAccordion={toggleAccordion}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Firmas */}
                <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mb-4">
                  <button
                    onClick={() => toggleAccordion("firmas")}
                    className="font-bold text-lg py-2 flex justify-between items-center w-full"
                  >
                    <span>Firmas</span>
                    <ExpandMoreIcon className="mr-2" />
                  </button>

                  {accordionStates.firmas && (
                    <div className="flex flex-col rounded-lg w-full">
                      <div className="flex flex-row justify-between w-auto mb-4">
                        <FirmaPrestamosEntrega
                          herramientaId={herramientaId}
                          accordionStates={accordionStates}
                          toggleAccordion={toggleAccordion}
                          onFirmaChange={handleFirmaChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón Enviar */}
                <div className="flex justify-center items-center w-2/4 mt-10 mx-auto">
                <div>
                  <button className="btn-danger2 mx-4" onClick={Navigate}>
                    Atrás
                  </button>
                  <button
                      className="btn-primary2 mr-2"
                      onClick={handleExportClickPDF}
                    >
                      PDF
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn-primary2 mr-2"
                      onClick={() => handleExportExcel(prestamoData)}
                      disabled={!prestamoData || !prestamoData.codigoFicha}
                    >
                      Excel
                    </button>
                  </div>
                  {prestamoData &&
                    prestamoData.EstadoId !== 7 &&
                    prestamoData.EstadoId !== 6 && (
                      <button
                        className="btn-black2"
                        onClick={handleSubmit}
                      >
                        Gestionar Préstamo
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default FirmaPrestamos;
