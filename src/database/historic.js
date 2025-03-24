import { getConnection } from "./connection.js";
import sql from "mssql";

const getDeviceHistoric = async (deviceId) => {
  const pool = await getConnection();

  try {
    const result = await pool.request().input("deviceId", sql.VarChar, deviceId)
      .query(`
            SELECT * FROM Historico
            WHERE IdEquipo = @deviceId
            ORDER BY fecha DESC
        `);

    return result.recordset;
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || error,
    };
  }
};

const createHistoric = async (historic) => {
  const pool = await getConnection();

  const { Id, IdEquipo, Observaciones, Creador, UsuarioAsignado, Tipo, Fecha } =
    historic;

  try {
    const result = await pool
      .request()
      .input("Id", sql.UniqueIdentifier, Id)
      .input("IdEquipo", sql.VarChar, IdEquipo)
      .input("Fecha", sql.DateTime, Fecha)
      .input("Observaciones", sql.VarChar, Observaciones)
      .input("Creador", sql.VarChar, Creador)
      .input("UsuarioAsignado", sql.VarChar, UsuarioAsignado)
      .input("Tipo", sql.VarChar, Tipo).query(`
                INSERT INTO Historico (Id, IdEquipo, Fecha, Observaciones, Creador, UsuarioAsignado, Tipo)
                VALUES (@Id, @IdEquipo, @Fecha, @Observaciones, @Creador, @UsuarioAsignado, @Tipo)
            `);

    return result.rowsAffected;
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || error,
    };
  }
};

export const Historic = {
  getDeviceHistoric,
  createHistoric,
};
