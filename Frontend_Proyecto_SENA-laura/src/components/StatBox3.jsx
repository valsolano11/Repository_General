import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { grey, green } from "@mui/material/colors";
import { api } from "../api/token";
import NewProgressCircle3 from "./NewProgressCircle3";

const StatBox3 = React.memo(({ icon })=> {
  const [herramientaMasUsada, setHerramientaMasUsada] = useState(null);
  const [usoHerramienta, setUsoHerramienta] = useState(0);
  const [totalPrestamos, setTotalPrestamos] = useState(0);
  const [condicion, setCondicion] = useState("");

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await api.get("/prestamos");
        const prestamos = response.data;

        setTotalPrestamos(prestamos.length);

        const herramientasContador = {};

        prestamos.forEach((prestamo) => {
          prestamo.Herramienta.forEach((herramienta) => {
            const nombreHerramienta = herramienta.nombre;
            if (!herramientasContador[nombreHerramienta]) {
              herramientasContador[nombreHerramienta] = 0;
            }
            herramientasContador[nombreHerramienta]++;
          });
        });

        const herramientaMasUsada = Object.keys(herramientasContador).reduce(
          (a, b) => (herramientasContador[a] > herramientasContador[b] ? a : b)
        );

        const usoHerramienta = herramientasContador[herramientaMasUsada];

        const responseHerramienta = await api.get("/herramienta");
        const herramientas = responseHerramienta.data;

        const herramientaDetalles = herramientas.find(
          (herramienta) => herramienta.nombre === herramientaMasUsada
        );

        setHerramientaMasUsada(herramientaMasUsada);
        setUsoHerramienta(usoHerramienta);

        setCondicion(
          herramientaDetalles?.condicion?.toUpperCase() || "DESCONOCIDA"
        );
      } catch (error) {
        console.error("Error al obtener los préstamos", error);
      }
    };

    fetchPrestamos();
  }, []);

  if (!herramientaMasUsada) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box width="100%" m="0 30px">
      <Typography variant="h" fontWeight="600">
        Herramienta más solicitada
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h6" fontWeight="bold" sx={{ color: grey[900] }}>
            {usoHerramienta} veces usada
          </Typography>
        </Box>

        <Box pr="20px">
          <NewProgressCircle3 progress={100} condicion={condicion} />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h" sx={{ color: green[500] }}>
          {herramientaMasUsada}
        </Typography>
        <Typography variant="h" sx={{ color: grey[900] }}>
          Condición: {condicion}
        </Typography>
      </Box>
    </Box>
  );
});

export default StatBox3;
