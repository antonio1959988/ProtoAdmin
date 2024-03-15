const Usuarios = require('../models/Usuarios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.registrarUsuario = async (req, res) => {
    // Leer los datos del usuario y colocarlos en usuarios
    const usuario = new Usuarios(req.body)

    usuario.password = await bcrypt.hash(req.body.password, 12)

    try {
        await usuario.save()
        res.json({mensaje: 'Usuario Creado Correctamente'})
    } catch (error) {
        console.log(error)
        res.json({mensaje: 'Hubo un error'})
    }
}

exports.autenticarUsuario = async (req, res, next) => {
    // Buscar el usuario
    const usuario = await Usuarios.findOne({ email: req.body.email })

    if(!usuario){
        // Si el usuario no existe
        await res.status(401).json({mensaje: 'Ese usuario no existe'}) // codigo no autorizado
        next()
    } else{
        // El usuario existe, verificar si el password es correcto o incorrecto
        if(!bcrypt.compareSync(req.body.password, usuario.password)){
            // Si el password es incorrecto
            await res.status(401).json({mensaje: 'Password Incorrecto'})
            next()
        } else{
            // password correcto, firmar un token
            const token = jwt.sign({
                email: usuario.email,
                nombre: usuario.nombre,
                id : usuario._id
            }, 'LLAVESECRETA', {
                expiresIn: '1h'
            })

            // Retornar el token
            res.json({ token })
        }
    }
}