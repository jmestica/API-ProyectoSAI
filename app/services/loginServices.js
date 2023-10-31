const db = require('../database')

const obtenerUsuario = async (username) => {

    let value

    const userData = await db.query("SELECT * FROM usuario WHERE email = $1", [username])

    userData.rows.length > 0 ? value = { hashedPassword: userData.rows[0].password, user: userData.rows[0].nombre_usuario } : value = null

    return value

}


const insertarUsuario = async (user) => {

    values = [user.nombre_usuario, user.email, user.password]
    const inserted = await db.query("INSERT INTO usuario VALUES ($1, $2, $3)", values)

    return inserted

}






module.exports = { obtenerUsuario, insertarUsuario }