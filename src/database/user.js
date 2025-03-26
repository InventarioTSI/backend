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

  const { id, userName, password, role } = user;

  try {
    const response = await pool
      .request()
      .input("id", sql.NVarChar, id)
      .input("userName", sql.NVarChar, userName)
      .input("password", sql.NVarChar, password)
      .input("role", sql.NVarChar, role)
      .query(
        `INSERT INTO Usuario (Id, Usuario, Pass, Rol) VALUES (@id, @userName, @password, @role)`
      );

    return {
      userData: {
        id: id,
        userName: userName,
        role: role,
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

export const User = {
  getUser,
  register,
  getAllUsers,
};
