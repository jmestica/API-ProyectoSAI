const loginServices = require('../services/loginServices')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {

    const { email, password } = req.body

    const userData = await loginServices.obtenerUsuario(email)

    console.log(userData);

    if (userData.hashedPassword) {

        const passwordMatch = await bcrypt.compare(password, userData.hashedPassword)

        if (passwordMatch) {

            res.send({loginStatus: true, message: 'Login exitoso', accessToken: userData.hashedPassword, user: userData.user})

        } else {

            res.send({loginStatus: false, message: 'Contraseña incorrecta'})

        }

    } else {

        res.send({loginStatus: false, message: 'Usuario no encontrado'})

    }




}

const signup = async (req, res) => {

    try {

        const { email, password, nombre_usuario } = req.body

        const hashedPassword = await bcrypt.hash(password, 8)

        const user = {
            email,
            nombre_usuario,
            password: hashedPassword
        }

        await loginServices.insertarUsuario(user)

        res.send('Usuario registrado exitosamente')


    } catch (error) {

        console.log(error)
        res.send("Error al registrar el usuario:")

    }

}

module.exports = { login, signup }