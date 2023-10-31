const express = require('express')
const router = express.Router()

const reactivosController = require('../controllers/reactivosController')


router.get('/getQR/:id', reactivosController.getQR)
router.get('/historial/:id', reactivosController.getHistorial)
router.get('/ultimo-consumo/:id', reactivosController.getUltimoConsumo)
router.post('/consumo/:id', reactivosController.agregarConsumo)
router.get('/compra/:id', reactivosController.getDatosCompra)

//Obtener el contador para realizar la codificación del reactivo
router.get('/contador', reactivosController.getContador)

router.get('/info/:id', reactivosController.getAllInfo)       
router.get('/getAll', reactivosController.getAll )
router.get('/:id', reactivosController.getReactivo)

//Alta de reactivos: Crear un nuevo reactivo en la base de datos
router.post('/', reactivosController.crearReactivo)




module.exports = router