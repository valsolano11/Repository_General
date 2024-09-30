import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../api/token";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      // Obtener perfil del usuario actual con el token
      api
        .get("/perfil", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          const perfil = response.data.perfil;
  
          // Llamada adicional a /usuarios/:id
          return api
            .get(`/usuarios/${perfil.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((usuarioResponse) => {
              const usuarioData = usuarioResponse.data;
              setUser({
                ...perfil,
                ...usuarioData, // Incluye la información del usuario y los permisos
                RolId: perfil.RolId,
              });
              setIsAuthenticated(true); // Usuario autenticado si ambas llamadas son exitosas
            })
            .catch((usuarioError) => {
              console.error("Error fetching usuario:", usuarioError);
              // Si falla la segunda llamada, el usuario sigue autenticado
              setUser({
                ...perfil,
                RolId: perfil.RolId,
              });
              setIsAuthenticated(true);
            });
        })
        .catch((error) => {
          console.error("Error fetching profile or invalid token:", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false); // Falla la autenticación si no se puede obtener el perfil
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);
  
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     api.get("/perfil", {
  //       headers: { Authorization: `Bearer ${token}` }
  //     })
  //     .then(response => {
  //       const perfil = response.data.perfil;
  //       setUser({
  //         ...perfil,
  //         RolId: perfil.RolId
  //       });
  //       setIsAuthenticated(true);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching profile or invalid token:", error);
  //       localStorage.removeItem("token");
  //       setIsAuthenticated(false);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  //   } else {
  //     setIsAuthenticated(false);
  //     setLoading(false);
  //   }
  // }, []);

  const signin = async ({ Documento, password }) => {
    try {
      const response = await api.post("/login", { Documento, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
  
      // Obtener el perfil una vez autenticado
      const perfilResponse = await api.get("/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const perfil = perfilResponse.data.perfil;
  
      // Llamada a la API de usuarios para obtener roles y permisos
      try {
        const usuarioResponse = await api.get(`/usuarios/${perfil.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usuarioData = usuarioResponse.data;
  
        // Setear usuario con la información completa (perfil + permisos)
        setUser({
          ...perfil,
          ...usuarioData,
          RolId: perfil.RolId,
        });
      } catch (usuarioError) {
        console.error("Error fetching usuario:", usuarioError);
        // Si falla obtener los permisos, se establece el perfil básico
        setUser({
          ...perfil,
          RolId: perfil.RolId,
        });
      }
  
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrors(error.response?.data || ["Error de autenticación"]);
      setIsAuthenticated(false);
    }
  };
  

  // const signin = async ({ Documento, password }) => {
  //   try {
  //     const response = await api.post("/login", { Documento, password });
  //     const { token } = response.data;
  //     localStorage.setItem("token", token);

  //     const perfilResponse = await api.get("/perfil", {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     const perfil = perfilResponse.data.perfil;
  //     setUser({
  //       ...perfil,
  //       RolId: perfil.RolId
  //     });
  //     setIsAuthenticated(true);
  //   } catch (error) {
  //     console.error("Login failed:", error.response?.data || error.message);
  //     setErrors(error.response?.data || ["Error de autenticación"]);
  //   }
  // };

  const signout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ signin, signout, user, isAuthenticated, loading, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};
