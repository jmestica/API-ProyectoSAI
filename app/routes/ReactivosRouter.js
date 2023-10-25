const express = require('express')
const router = express.Router()

const reactivosController = require('../controllers/reactivosController')


router.get('/getQR/:id', reactivosController.getQR)
router.get('/historial/:id', reactivosController.getHistorial)
router.post('/movimiento/:id', reactivosController.agregarMovimiento)
router.get('/compra/:id', reactivosController.getDatosCompra)
router.get('/info/:id', reactivosController.getAllInfo) 

//Obtener el contador para realizar la codificación del reactivo
router.get('/contador', reactivosController.getContador)
router.get('/:id', reactivosController.getPieza)

//Alta de reactivos: Crear un nuevo reactivo en la base de datos
router.post('/', reactivosController.crearReactivo)





module.exports = router