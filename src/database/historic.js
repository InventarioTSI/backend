import { getConnection } from "./connection.js";
import sql from "mssql";

const getDeviceHistoric = async (deviceId) => {
  const pool = await getConnection();

  try {
    const result = await pool.request().input("deviceId", sql.VarChar, deviceId)
      .query(`
        SELECT * FROM Historico
        WHERE IdEquipo = @deviceId
        AND Observaciones NOT LIKE '%actualización del dispositivo%'
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

  // Validación adicional
  if (!historic.Observaciones || historic.Observaciones.trim() === "") {
    throw new Error("Las observaciones son obligatorias");
  }

  // Evitar registros genéricos
  if (
    historic.Observaciones.toLowerCase().includes(
      "actualización del dispositivo"
    )
  ) {
    return 0; // No crear este registro
  }

  try {
    const result = await pool
      .request()
      .input("Id", sql.UniqueIdentifier, historic.Id || uuidv4())
      .input("IdEquipo", sql.VarChar, historic.IdEquipo)
      .input("Fecha", sql.DateTime, historic.Fecha || new Date())
      .input("Observaciones", sql.VarChar, historic.Observaciones)
      .input("Creador", sql.VarChar, historic.Creador)
      .input("UsuarioAsignado", sql.VarChar, historic.UsuarioAsignado || null)
      .input("Tipo", sql.VarChar, historic.Tipo || "Modificación").query(`
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
