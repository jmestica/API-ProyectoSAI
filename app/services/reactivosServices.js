const db = require('../database');

const getReactivo = async (id) => {

    const { rows } = await db.query(`
  SELECT
    *
  FROM reactivo
  WHERE codigo = $1
`, [id]);

    return rows;
}


const crearReactivo = async (nuevoReactivo) => {

    const values = [nuevoReactivo.codigo, nuevoReactivo.observaciones, nuevoReactivo.nombre_reactivo, nuevoReactivo.cantidad, nuevoReactivo.fecha_vto, nuevoReactivo.nro_lote, nuevoReactivo.fecha_ingreso, nuevoReactivo.nro_expediente, nuevoReactivo.conservacion, nuevoReactivo.fecha_finalizacion, nuevoReactivo.marca, nuevoReactivo.fecha_descarte, nuevoReactivo.contador]

    const response = await db.query('INSERT INTO reactivo VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', values)

    return response.rowCount === 1? true: false

}

//Consulta para obtener el ID de la última inserción de reactivo
const getContador = async () => {

    const res = await db.query('SELECT MAX(contador) AS ultima_insercion FROM reactivo')

    const contador = res.rows[0].ultima_insercion

    return contador === null ? 0 : contador;
}


/* registrar consumo:

    cantidad_usada, registro_consumo, cantidad_actual, codigo, nombre_usuario,
    */


const agregarConsumo = async (nuevoConsumo) => {
    const values = [nuevoConsumo.cantidad_usada, nuevoConsumo.registro_consumo, nuevoConsumo.cantidad_actual, nuevoConsumo.codigo, nuevoConsumo.nombre_usuario];
    const res = await db.query('INSERT INTO consumo (cantidad_usada, registro_consumo, cantidad_actual, codigo, nombre_usuario) VALUES ($1, $2, $3, $4, $5)', values);
    return res.rowCount;
}


const getHistorial = async (ID_Reactivo) => {

    const { rows } = await db.query('SELECT * FROM consumo WHERE codigo = $1 ORDER BY registro_consumo DESC', [ID_Reactivo])

    return rows

}

const getUltimoConsumo = async (ID_Reactivo) => {
    const { rows } = await db.query(
        'SELECT * FROM consumo WHERE codigo = $1 AND registro_consumo = (SELECT MAX(registro_consumo) FROM consumo WHERE codigo = $1) ORDER BY id_consumo DESC LIMIT 1',
        [ID_Reactivo]
    );

    return rows.length > 0 ? rows[0] : null;
}


const getAllInfo = async (ID_Pieza) => {

    const { rows } = await db.query('SELECT movimiento.*, pieza.*, es_comprada.* FROM movimiento  INNER JOIN pieza ON movimiento.id_pieza = pieza.id_pieza  INNER JOIN es_comprada ON pieza.id_pieza = es_comprada.id_pieza WHERE movimiento.id_pieza = $1', [ID_Pieza])

    return rows

}

const getAll = async () => {

    const { rows } = await db.query('SELECT * FROM reactivo');

    return rows;


}

const getFiltrados = async (labFilter, tipoFilter, stockFilter) => {

    try {
        let sql;

        if (labFilter) {
            const labInitial = labFilter.charAt(0).toUpperCase(); // Obtén la primera letra del nombre del laboratorio en mayúscula
            sql = 'SELECT * FROM consumo INNER JOIN reactivo ON consumo.codigo = reactivo.codigo WHERE reactivo.codigo LIKE $1';

            const values = [`${labInitial}%`]; // Inicializa el arreglo de valores con la letra del laboratorio

            if (stockFilter === 'En Stock') {
                sql += ' AND reactivo.cantidad_actual > 0';
            } else if (stockFilter === 'Sin Stock') {
                sql += ' AND (reactivo.fecha_finalizacion IS NOT NULL)'; // Agrega la condición para cantidad igual o menor a 0 o nula
            } else if (stockFilter === 'Descartado') {
                sql += ' AND reactivo.fecha_descarte IS NOT NULL';
            } else if (stockFilter === 'Vencido') {
                sql += ' AND reactivo.fecha_vto < CURRENT_DATE';
            }

            if (tipoFilter) {
                sql += ' AND reactivo.nombre_reactivo = $2';
                values.push(tipoFilter);
            }

            // Realiza la consulta a la base de datos con los filtros aplicados
            const { rows } = await db.query(sql, values);

            return rows.length > 0 ? rows : null;
        } else {
            return null; // Devuelve null si no se especifica el laboratorio
        }
    } catch (error) {
        console.error("Error al obtener los reactivos filtrados", error);
    }
}

const finishedReactivo = async (ID_Reactivo, fechaFinalizacion) => {

    try {

        const { rowCount }  = await db.query(
            'UPDATE reactivo SET fecha_finalizacion = $1 WHERE codigo = $2',
            [fechaFinalizacion, ID_Reactivo]
        );

        return rowCount; 

    } catch (error) {
        console.error("Error al registrar la fecha de finalización del reactivo", error);
    }

};


const editarReactivo = async (ID_Reactivo, updates) => {

    const values = [
        updates.observaciones,
        updates.cantidad,
        updates.fecha_vto,
        updates.nro_lote,
        updates.nro_expediente,
        updates.conservacion,
        updates.marca,
        ID_Reactivo
    ];

    
    try {
        const response = await db.query(
            'UPDATE reactivo SET observaciones = $1, cantidad = $2, fecha_vto = $3, nro_lote = $4, nro_expediente = $5, conservacion = $6, marca = $7 WHERE codigo = $8',
            values
        );

        return response.rowCount === 1; 
    } catch (error) {
        console.error('Error al actualizar el reactivo:', error);
        return false;
    }
  

}

module.exports = {
    getReactivo,
    crearReactivo,
    getContador,
    agregarConsumo,
    getHistorial,
    getAllInfo,
    getAll,
    getUltimoConsumo,
    getFiltrados,
    finishedReactivo,
    editarReactivo
}