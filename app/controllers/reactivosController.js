const qrcode = require('qrcode');
const reactivosServices = require('../services/reactivosServices');

// Este endpoint, es para obtener la información referente a una pieza,
// su historial e información de compra.
const getReactivo = async (req, res) => {

    const ID_Reactivo = req.params.id;

    const response = await reactivosServices.getReactivo(ID_Reactivo);

    res.send(response);
}


/* Este endpoint, es para obtener el QR de una pieza, puede ser utilizado
 cuando recién es creada la pieza, o bien cuando se quiere obtener nuevamente
 el QR de la pieza, por pérdidas o daños */

const getQR = (req, res) => {

    const codigo_reactivo = req.params.id
    
    const IP = process.env.IP

    const url = `http://${IP}/tracker/gestionar-reactivo/${codigo_reactivo}`

    qrcode.toDataURL(url, (err, src) => {
        if (err) res.send("No se pudo crear el QR de la pieza");
        res.send({ qr_code: src });
    });

}

//Este endpoint es para dar de alta un nuevo reactivo en la base de datos.
const crearReactivo = async (req, res) => {

    const nuevoReactivo = req.body

    const response = await reactivosServices.crearReactivo(nuevoReactivo)
  
    response ? res.sendStatus(200) : res.sendStatus(400) 
}

//Endpoint para obtener el ID de la ultima inserción en la base de datos para codificar nuevos reactivos
const getContador = async (req, res) => {

    const numero_contador = await reactivosServices.getContador()

    res.send({ numero_contador: numero_contador })

}

//Este endpoint es para obtener todos los movimientos de una determinada fecha.
const getHistorial = async (req, res) => {

    const ID_Reactivo = req.params.id
    const response = await reactivosServices.getHistorial(ID_Reactivo)
    res.send(response)
}

const getUltimoConsumo = async (req, res) => {

    const ID_Reactivo = req.params.id;

    const response = await reactivosServices.getUltimoConsumo(ID_Reactivo);

    res.send(response);

}


//Este endpoint es para crear un nuevo movimiento en la pieza
const agregarConsumo = async (req, res) => {

    const nuevoConsumo = req.body

    const response = await reactivosServices.agregarConsumo(nuevoConsumo)

    response === 1 ? res.send({ success: true }) : res.send({ success: false })

}


const getAllInfo = async (req, res) => {

    const ID_Pieza = req.params.id

    const response = await reactivosServices.getAllInfo(ID_Pieza)

    response.map((item) => {
        item.hora = item.hora.slice(0, 5),
            item.fecha = item.fecha.toLocaleDateString()
    })


    res.send(response)

}

const getAll = async (req, res) => {

    try {
        const response = await reactivosServices.getAll()
        res.send(response)
    } catch (error) {
        console.error(error)
        res.send(error)
    }

}

const getFiltrados = async (req, res) => {
    const { labFilter, tipoFilter, stockFilter } = req.query;

    try {
        // Modifica la consulta SQL para realizar el INNER JOIN
        const response = await reactivosServices.getFiltrados(labFilter, tipoFilter, stockFilter);

        if (response == null) {
            res.send({
                msg: "No se encontraron reactivos que cumplan con los filtros seleccionados",
                data: null,
                status: 400
            });
        } else {
            res.send(response);
        }
    } catch (error) {
        console.error(error);
        res.send(error);
    }
};


const finishedReactivo = async (req, res) => {

    const ID_Reactivo = req.params.id;
    const fechaFinalizacion = new Date().toLocaleDateString();

    try {
        const response = await reactivosServices.finishedReactivo(ID_Reactivo, fechaFinalizacion);
        response === 1 
        ? res.send({msg: "Fecha de finalización insertada correctamente.", status: 200}) 
        : res.send({msg: "No se pudo insertar la fecha de finalización del reactivo.", status: 400});

    } catch (error) {
        console.error(error)
        res.send(error)
    }
}


const updateReactivo = async (req, res) => {

    const ID_Reactivo = req.params.id;
    const updates = req.body;

    const resp = await reactivosServices.editarReactivo(ID_Reactivo, updates)

    res.send(resp)
    
}

module.exports = {
    getReactivo,
    getQR,
    crearReactivo,
    getContador,
    getHistorial,
    agregarConsumo,
    getAllInfo,
    getAll,
    getUltimoConsumo,
    getFiltrados,
    finishedReactivo,
    updateReactivo
} 