const db = require('../database');

const getReactivo = async (id) => {

    const { rows } = await db.query(`
  SELECT
    nombre_reactivo,
    cantidad,
    marca,
    fecha_ingreso,
    fecha_vto
  FROM reactivo
  WHERE codigo = $1
`, [id]);

    return rows;
}


const crearReactivo = async (nuevaPieza) => {

    const values = [nuevaPieza.ID_Pieza, nuevaPieza.nombre, nuevaPieza.descripcion, nuevaPieza.cantidad, nuevaPieza.unidad]

    const { rows } = await db.query('INSERT INTO pieza VALUES ($1, $2, $3, $4, $5)', values)

    const es_comprada_values = [nuevaPieza.ID_Pieza, nuevaPieza.es_comprada.nombre_vendedor, nuevaPieza.es_comprada.fecha, nuevaPieza.es_comprada.monto_compra]
    const { es_comprada } = await db.query('INSERT INTO es_comprada VALUES ($1, $2, $3, $4)', es_comprada_values)

    return true

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


const getDatosCompra = async (ID_Pieza) => {

    const { rows } = await db.query('SELECT * FROM es_comprada WHERE id_pieza = $1', [ID_Pieza])

    return rows

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
        let sql = 'SELECT * FROM reactivo WHERE ';

        if (labFilter) {
            const labInitial = labFilter.charAt(0).toUpperCase(); // Obtén la primera letra del nombre del laboratorio en mayúscula
            sql += `codigo LIKE $1`;
            values = [`${labInitial}%`]; // Inicializa el arreglo de valores con la letra del laboratorio

            if (stockFilter === 'En Stock') {
                sql += ' AND cantidad > 0';
            } else if (stockFilter === 'Sin Stock') {
                sql += ' AND (fecha_finalizacion IS NOT NULL)'; // Agrega la condición para cantidad igual o menor a 0 o nula
            } else if (stockFilter === 'Descartado') {
                sql += ' AND fecha_descarte IS NOT NULL';
            } else if (stockFilter === 'Vencido') {
                sql += ' AND fecha_vto < CURRENT_DATE';
            }

            if (tipoFilter) {
                sql += ' AND nombre_reactivo = $2';
                values.push(tipoFilter);
            }
        } else {
            return null; // Devuelve null si no se especifica el laboratorio
        }

        // Realiza la consulta a la base de datos con los filtros aplicados
        const { rows } = await db.query(sql, values);

        return rows.length > 0 ? rows : null;
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


module.exports = {
    getReactivo,
    crearReactivo,
    getContador,
    agregarConsumo,
    getHistorial,
    getDatosCompra,
    getAllInfo,
    getAll,
    getUltimoConsumo,
    getFiltrados,
    finishedReactivo
}