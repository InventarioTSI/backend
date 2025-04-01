import { User } from "../database/user.js"; // Ajusta la ruta si es necesario
import { createAccessToken } from "../lib/jwt.js";
import { authService } from "../services/auth.service.js";
import { body, validationResult } from "express-validator";

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

const register = async (req, res) => {
  try {
    // Validar que los campos requeridos estén presentes
    await body("userName").notEmpty().run(req);
    await body("password").notEmpty().run(req);
    await body("role").notEmpty().run(req); 

    // Puedes agregar más validaciones según sea necesario
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: "FAILED", data: "Todos los campos son obligatorios" });
    }

    // Si la validación pasa, proceder a registrar el usuario
    const newUser = {
      userName: req.body.userName,
      password: req.body.password,
      role: req.body.role,
    };

    const registeredUser = await authService.register(newUser);

    const token = await createAccessToken({ id: registeredUser.id });

    return res
      .status(201)
      .send({ status: "OK", data: registeredUser, token: token });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).send({ status: "FAILED", data: error.message });
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

export { getAllUsersHandler, checkAdminHandler, register, deleteUserHandler, updateUserHandler }; // Exportar la función