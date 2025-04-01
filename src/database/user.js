import { getConnection } from "../database/connection.js";
import sql from "mssql";

const getUser = async (userName) => {
  const pool = await getConnection();

  try {
    const response = await pool
      .request()
      .input("userName", sql.NVarChar, userName)
      .query(`SELECT * FROM Usuario WHERE Usuario = @userName`);

    const result = response.recordset[0];

    if (!result) return null;

    return {
      userData: {
        id: result.Id,
        userName: result.Usuario,
        password: result.Pass,
        role: result.Rol,
      },
    };
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || error,
    };
  }
};

const register = async (user) => {
  const pool = await getConnection();

  const { userName, password, role } = user;

  try {
    const response = await pool
      .request()
      .input("userName", sql.NVarChar, userName)
      .input("password", sql.NVarChar, password)
      .input("role", sql.NVarChar, role)
      .query(
        `INSERT INTO Usuario (Usuario, Pass, Rol) VALUES (@userName, @password, @role);
         SELECT SCOPE_IDENTITY() AS Id;` // Obtiene el ID generado automáticamente si no se especifica
      );

    const newId = response.recordset[0]?.Id; // Usa el id proporcionado o el generado automáticamente

    return {
      userData: {
        id: newId,
        userName,
        role,
      },
    };
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || error,
    };
  }
};

const getAllUsers = async () => {
  const pool = await getConnection();

  try {
    const response = await pool.request().query(`SELECT * FROM Usuario`);

    const users = response.recordset;

    return users.map((user) => ({
      id: user.Id,
      userName: user.Usuario,
      role: user.Rol,
    }));
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || error,
    };
  }
};

const deleteUser = async (userId) => {
  const pool = await getConnection();

  try {
    const result = await pool
      .request()
      .input("id", sql.Int, userId)
      .query(`DELETE FROM Usuario WHERE Id = @id`);

    return result; // Devuelve el resultado para verificar si se eliminó algo
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || "Error al eliminar el usuario",
    };
  }
};

const update = async (userId, user) => {
  const pool = await getConnection();

  const { userName, role } = user;

  try {
    const result = await pool
      .request()
      .input("id", sql.Int, userId)
      .input("userName", sql.NVarChar, userName)
      .input("role", sql.NVarChar, role)
      .query(
        `UPDATE Usuario
         SET Usuario = @userName, Rol = @role
         WHERE Id = @id`
      );

    return result; // Devuelve el resultado para verificar si se actualizó algo
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || "Error al actualizar el usuario",
    };
  }
};

export const User = {
  getUser,
  register,
  getAllUsers,
  delete: deleteUser, 
  update,
};
