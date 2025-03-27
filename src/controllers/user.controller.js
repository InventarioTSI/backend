import { User } from "../database/user.js"; // Ajusta la ruta si es necesario

const getAllUsersHandler = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users); // Enviar los usuarios al frontend
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message }); // Manejo de errores
  }
};

const checkAdminHandler = (req, res) => {
  const user = req.user; // `req.user` contiene la información del usuario autenticado

  if (!user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (user.role !== "Admin") {
    return res.status(403).json({ isAdmin: false });
  }

  res.json({ isAdmin: true });
};

export { getAllUsersHandler, checkAdminHandler }; // Exportar la función