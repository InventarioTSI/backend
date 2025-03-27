import { getConnection } from "../database/connection.js";
import sql from "mssql";
import { mapToHtmlInputType } from "../lib/utils.js";
import { PORT } from "../config.js";
import axios from "axios";

const getAllDevices = async (
  page,
  limit,
  searchTerm,
  stateFilter,
  employeeFilter
) => {
  const pool = await getConnection();

  const offset = (page - 1) * parseInt(limit);

  // Construcción dinámica de condiciones de filtros
  const conditions = [];

  // Filtro de búsqueda (searchTerm)
  if (searchTerm) {
    conditions.push(
      `(Tipo LIKE @searchTerm OR Observaciones LIKE @searchTerm OR Referencia LIKE @searchTerm)`
    );
  }

  // Filtro de estado (stateFilter)
  if (stateFilter) {
    conditions.push(`Estado = @stateFilter`);
  }

  // Filtro de empleado (employeeFilter)
  if (employeeFilter) {
    conditions.push(`PuestosTrabajo = @employeeFilter`);
  }

  // Si no hay condiciones, no se añade WHERE
  const whereCondition =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    // Consulta de dispositivos con filtros y paginación
    const result = await pool
      .request()
      .input("searchTerm", sql.NVarChar, `%${searchTerm}%`)
      .input("stateFilter", sql.NVarChar, stateFilter)
      .input("employeeFilter", sql.NVarChar, employeeFilter)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, parseInt(limit)).query(`
        SELECT * FROM (
          SELECT 'Cable' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Cable
          UNION ALL
          SELECT 'Camara' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Camara
          UNION ALL
          SELECT 'DAQ' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM DAQ
          UNION ALL
          SELECT 'Impresora' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Impresora
          UNION ALL
          SELECT 'LectorDiscos' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM LectorDiscos
          UNION ALL
          SELECT 'MemoriaExterna' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM MemoriaExterna
          UNION ALL
          SELECT 'OrdenadorPortatil' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM OrdenadorPortatil
          UNION ALL
          SELECT 'OrdenadorSobremesa' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM OrdenadorSobremesa
          UNION ALL
          SELECT 'Otros' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Otros
          UNION ALL
          SELECT 'Pantalla' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Pantalla
          UNION ALL
          SELECT 'Raton' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Raton
          UNION ALL
          SELECT 'Router' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Router
          UNION ALL
          SELECT 'Servidor' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Servidor
          UNION ALL
          SELECT 'Switch' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Switch
          UNION ALL
          SELECT 'Tablet' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Tablet
          UNION ALL
          SELECT 'Teclado' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Teclado
          UNION ALL
          SELECT 'TelefonoMovil' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM TelefonoMovil
        ) AS dispositivos
        ${whereCondition}  -- Aplica las condiciones de filtro si las hay
        ORDER BY dispositivos.Tipo
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
    `);

    // Total de dispositivos con filtros aplicados
    const totalResult = await pool
      .request()
      .input("searchTerm", sql.NVarChar, `%${searchTerm}%`)
      .input("stateFilter", sql.NVarChar, stateFilter)
      .input("employeeFilter", sql.NVarChar, employeeFilter).query(`
        SELECT COUNT(*) AS total FROM (
          SELECT 'Cable' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Cable
          UNION ALL
          SELECT 'Camara' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Camara
          UNION ALL
          SELECT 'DAQ' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM DAQ
          UNION ALL
          SELECT 'Impresora' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Impresora
          UNION ALL
          SELECT 'LectorDiscos' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM LectorDiscos
          UNION ALL
          SELECT 'MemoriaExterna' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM MemoriaExterna
          UNION ALL
          SELECT 'OrdenadorPortatil' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM OrdenadorPortatil
          UNION ALL
          SELECT 'OrdenadorSobremesa' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM OrdenadorSobremesa
          UNION ALL
          SELECT 'Otros' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Otros
          UNION ALL
          SELECT 'Pantalla' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Pantalla
          UNION ALL
          SELECT 'Raton' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Raton
          UNION ALL
          SELECT 'Router' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Router
          UNION ALL
          SELECT 'Servidor' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Servidor
          UNION ALL
          SELECT 'Switch' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Switch
          UNION ALL
          SELECT 'Tablet' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Tablet
          UNION ALL
          SELECT 'Teclado' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM Teclado
          UNION ALL
          SELECT 'TelefonoMovil' AS Tipo, Id, Referencia, Modelo, AñoCompra, PuestosTrabajo, Observaciones, Estado, NumSerie, Factura FROM TelefonoMovil
        ) AS dispositivos
        ${whereCondition}  -- Aplica las condiciones de filtro si las hay
    `);

    const total = totalResult.recordset[0].total;

    // Consulta de empleados para el filtro de PuestosTrabajo
    const employees = await pool.request().query(`
      SELECT * FROM PuestosTrabajo
    `);

    return { devices: result.recordset, total, employees: employees.recordset };
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || error,
    };
  }
};

const getOneDevice = async (deviceType, deviceId) => {
  const pool = await getConnection();

  const schemaResult = await pool
    .request()
    .query(
      `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${deviceType}'`
    );

  const schemaMap = new Map();
  schemaResult.recordset.forEach((row) => {
    schemaMap.set(row.COLUMN_NAME, row.DATA_TYPE);
  });

  try {
    const response = await pool
      .request()
      .input("deviceId", sql.NVarChar, deviceId)
      .query(`SELECT * FROM ${deviceType} WHERE id = @deviceId`);

    if (response.recordset.length === 0) {
      throw {
        status: 404,
        message: "Device not found",
      };
    }

    return {
      deviceFields: Object.keys(response.recordset[0]).map((key) => ({
        name: key,
        value: response.recordset[0][key],
        type: mapToHtmlInputType(schemaMap.get(key)),
      })),
    };
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || error,
    };
  }
};

const getDeviceForm = async (deviceType) => {
  const pool = await getConnection();

  const response = await pool
    .request()
    .query(
      `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${deviceType}'`
    );

  return {
    deviceFields: response.recordset.map((row) => ({
      name: row.COLUMN_NAME,
      type: mapToHtmlInputType(row.DATA_TYPE),
    })),
  };
};

const createDevice = async (device, creador) => {
  const pool = await getConnection();

  const { deviceType, fields } = device;

  try {
    await pool.request().query(
      `INSERT INTO ${deviceType} (${Object.keys(fields).join(
        ", "
      )}) VALUES (${Object.values(fields)
        .map((value) => `'${value}'`)
        .join(", ")})`
    );

    try {
      const UsuarioAsignado = await pool
        .request()
        .query(
          `SELECT Empleado FROM PuestosTrabajo WHERE Puesto = ${fields.PuestosTrabajo}`
        );

      await axios.post(`http://localhost:${PORT}/api/historic`, {
        IdEquipo: fields.Id,
        Observaciones: "Dispositivo creado",
        Creador: creador,
        UsuarioAsignado: UsuarioAsignado.recordset[0].Empleado,
        Tipo: "actualización",
      });
    } catch (error) {
      throw {
        status: 500,
        message: error?.message || error,
      };
    }

    return {
      deviceData: {
        id: fields.Id,
        deviceType: deviceType,
      },
    };
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || error,
    };
  }
};

const updateDevice = async (deviceType, deviceId, changes, creador) => {
  const pool = await getConnection();

  await pool
    .request()
    .input("deviceType", sql.NVarChar, deviceType)
    .input("deviceId", sql.NVarChar, deviceId)
    .query(
      `UPDATE ${deviceType} SET ${Object.entries(changes)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(", ")} WHERE id = '${deviceId}'`
    );

  try {
    const UsuarioAsignado = await pool
      .request()
      .query(
        `SELECT Empleado FROM PuestosTrabajo WHERE Puesto = ${changes.PuestosTrabajo}`
      );

    await axios.post(`http://localhost:${PORT}/api/historic`, {
      IdEquipo: deviceId,
      Observaciones: "Dispositivo Actualizado",
      Creador: creador,
      UsuarioAsignado: UsuarioAsignado.recordset[0].Empleado,
      Tipo: "actualización",
    });
  } catch (error) {
    throw {
      status: 500,
      message: error?.message || error,
    };
  }

  return {
    deviceData: {
      ...changes,
    },
  };
};

const deleteDevice = async (deviceType, deviceId) => {
  try {
    const pool = await getConnection();

    const response = await pool
      .request()
      .input("deviceId", sql.NVarChar, deviceId)
      .query(`DELETE FROM ${deviceType} WHERE id = @deviceId`);

    return {
      message: "Device deleted",
    };
  } catch (error) {
    return {
      message: error.message,
    };
  }
};

export const Device = {
  getAllDevices,
  getOneDevice,
  getDeviceForm,
  createDevice,
  updateDevice,
  deleteDevice,
};
