const Pedidos = require('../models/Pedidos')

exports.nuevoPedido = async (req, res, next) => {
    const pedido = new Pedidos(req.body)

    try {
        await pedido.save()
        res.json({ mensaje: 'Se agregó un nuevo pedido' })
    } catch (error) {
        console.log(error)
        next()
    }

}

// Muestra todos los pedidos
exports.mostrarPedidos = async(req, res, next) => {
    try {
        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        })
        res.json(pedidos)
    } catch (error) {
        console.log(error)
        next()
    }
}

// Muestra un pedidp por su id
exports.mostrarPedido = async(req, res, next) => {

        const pedido = await Pedidos.findById(req.params.idPedido).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        })
     
        if(!pedido){
            res.json('Ese pedido no existe')
        return next()
        }
        
    

       // Mostrar el pedido
       res.json(pedido)
    
}

// Actualizar el pedido por id
exports.actualizarPedido = async (req, res, next) => {
    try {
        let pedido = await Pedidos.findOneAndUpdate({_id: req.params.idPedido}, req.body, {
            new: true
        })
        .populate('cliente')
        .populate({
            path: 'pedido.producto',
            model: 'Productos'
        })

        res.json(pedido)
    } catch (error) {
        console.log(error)
        next()
    }
}

// Elimina un pedido por su id
exports.eliminarPedido = async(req, res, next) => {
    try {
        await Pedidos.findOneAndDelete({ _id: req.params.idPedido })

        res.json({ mensaje: 'El pedido se ha eliminado' })
    } catch (error) {
        console.log(error)
        next()
    }
}