import { User } from "../database/user.js"; // Ajusta la ruta si es necesario

const getAllUsersHandler = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users); // Enviar los usuarios al frontend
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message }); // Manejo de errores
  }
};

export { getAllUsersHandler }; // Exportar la función