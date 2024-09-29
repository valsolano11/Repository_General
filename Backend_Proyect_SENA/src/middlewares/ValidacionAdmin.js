export const ValidacionAdmin = async (req,res) =>{
    try {
        const DOCUMENT_ADMIN = process.env.DOCUMENT_ADMIN;
        const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;
        
        const {documento, password} = req.user
        if (documento !== DOCUMENT_ADMIN || password !== PASSWORD_ADMIN) {
        return res.status(403).json({message: "Acceso denegado, no se puede mostrar permisos"})
        }
        next()
    } catch (error) {
        console.error("Error en la validación de administrador principal:", error);
    return res.status(500).json({ message: "Error en la validación del administrador principal" });
    }
}