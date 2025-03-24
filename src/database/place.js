import { getConnection } from "../database/connection.js";
import sql from "mssql";

const getAllPlaces = async () => {
  const pool = await getConnection();

  try {
    const result = await pool.request().query(`
      SELECT * FROM PuestosTrabajo
    `);

    return result.recordset;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOnePlace = async (place) => {
  const pool = await getConnection();

  try {
    const response = await pool
      .request()
      .input("place", sql.NVarChar, place)
      .query(`SELECT * FROM PuestosTrabajo WHERE puesto = @place`);

    if (response.recordset.length === 0) {
      throw new Error("Place not found");
    }

    return response.recordset[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPlace = async (Puesto, Empleado, Planta) => {
  const pool = await getConnection();

  try {
    const response = await pool
      .request()
      .input("Puesto", sql.NVarChar, Puesto)
      .input("Empleado", sql.NVarChar, Empleado)
      .input("Planta", sql.NVarChar, Planta)
      .query(
        `INSERT INTO PuestosTrabajo (puesto, empleado, planta) VALUES (@Puesto, @Empleado, @Planta)`
      );

    return response.recordset;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatePlace = async (Puesto, changes) => {
  const pool = await getConnection();

  try {
    const response = await pool
      .request()
      .input("Puesto", sql.NVarChar, Puesto)
      .input("Empleado", sql.NVarChar, changes.Empleado)
      .input("Planta", sql.NVarChar, changes.Planta).query(`
        UPDATE PuestosTrabajo
        SET empleado = @Empleado, planta = @Planta
        WHERE puesto = @Puesto
      `);

    return response.recordset;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePlace = async (place) => {
  const pool = await getConnection();

  try {
    const response = await pool
      .request()
      .input("place", sql.NVarChar, place)
      .query(`DELETE FROM PuestosTrabajo WHERE puesto = @place`);

    return response.recordset;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const Place = {
  getAllPlaces,
  getOnePlace,
  createPlace,
  updatePlace,
  deletePlace,
};
