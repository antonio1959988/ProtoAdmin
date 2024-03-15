const Productos = require('../models/Productos')

// Configuracion multer
const multer = require('multer')
const shortid = require('shortid')

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/')
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1]
            cb(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, cb) {
        if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
            cb(null, true)
        } else {
            cb(new Error('Formato no válido'))
        }
    }
}

// Pasar la configuracion y el campo
const upload = multer(configuracionMulter).single('imagen')

// Sube un archivo
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function(err) {
        if(err){
            res.json({ mensaje: err })
        }
        return next()
    })
}

// Agrega nuevos productos
exports.nuevoProducto = async(req, res, next) => {
    const producto = new Productos(req.body)

    try {
        if(req.file.filename){
            producto.imagen = req.file.filename
        }
        await producto.save()
        res.json({ mensaje: 'Se agregó un nuevo producto' })
    } catch (error) {
        console.log(error)
        next()
    }
}

// Muestra todos los productos
exports.mostrarProductos = async(req, res, next) => {
    try {
        // Obtener todos los productos
        const productos = await Productos.find({})
        res.json(productos)
    } catch (error) {
        console.log(error)
        next()
    }
}

// Muestra un producto en especifico por su id
exports.mostrarProducto = async(req, res, next) => {
    const producto = await Productos.findById(req.params.idProducto)

    if(!producto){
        res.json({ mensaje: 'Ese producto no existe' })
        return next()
    }

    // Mostrar el producto
    res.json(producto)
}

// Actualiza un producto por su id
exports.actualizarProducto = async(req, res, next) => {
    try {
        // Construir un nuevo producto
        let nuevoProducto = req.body

        // Verificar si hay imagen nueva
        if(req.file){
            nuevoProducto.imagen = req.file.filename
        } else {
            let productoAnterior = await Productos.findById(req.params.idProducto)
            nuevoProducto.imagen = productoAnterior.imagen
        }



        let producto = await Productos.findByIdAndUpdate({ _id: req.params.idProducto }, nuevoProducto, {
            new: true
        })
        res.json(producto)
    } catch (error) {
        console.log(error)
        return next()
    }
}

// Elimina un producto por id
exports.eliminarProducto = async(req, res, next) => {
    try {

        // PDD eliminar imagen del back
        await Productos.findOneAndDelete({ _id: req.params.idProducto })
        res.json({ mensaje: 'El producto se ha eliminado' })
    } catch (error) {
        console.log(error)
        next()
    }
}

// Busca un producto con query
exports.buscarProducto = async (req, res, next) => {
    try {
        // Obtener el query
        const { query } = req.params
        const producto = await Productos.find({ nombre: new RegExp(query, 'i') })
        res.json(producto)
    } catch (error) {
        console.log(error)
        next()
    }
}