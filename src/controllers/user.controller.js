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

const createUserHandler = async (req, res) => {
  const {userName, password, role } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!userName || !password || !role) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Llamar al modelo para registrar el usuario
    const newUser = await User.register({ userName, password, role });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: newUser.userData, // Enviar los datos del usuario creado
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteUserHandler = async (req, res) => {
  const { userId } = req.params; // Obtén el ID del usuario desde los parámetros de la URL

  try {
    // Llamar al modelo para eliminar el usuario
    const result = await User.delete(userId);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateUserHandler = async (req, res) => {
  const { userId } = req.params; // Obtén el ID del usuario desde los parámetros de la URL
  const { userName, role } = req.body; // Obtén los datos del cuerpo de la solicitud

  // Validar que los campos requeridos estén presentes
  if (!userName || !role) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Llamar al modelo para actualizar el usuario
    const result = await User.update(userId, { userName, role });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export { getAllUsersHandler, checkAdminHandler, createUserHandler, deleteUserHandler, updateUserHandler }; // Exportar la función