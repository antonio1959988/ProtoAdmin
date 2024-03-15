const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require ('dotenv').config({ path: 'variables.env' })

// Cors permite que un cliente se conecte a otro servidor para el intercambio de recurso
const cors = require('cors')

// Conectar mongo
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
})

// Crear el servidor
const app = express()

// Habilitar body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// Definir un dominio para recibir las peticiones
const whiteList = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: (origin, callback) => {
        // Revisar si la peticion viene de un servidor whitelist
        const existe = whiteList.some( dominio => dominio === origin )

        if(existe){
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

// Habilitar cors
app.use(cors())

// Rutas de la app
app.use('/', routes())

// Especificar ruta estatica para los assets
app.use(express.static('uploads'))

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 5000

// iniciar app
app.listen(port, host, () => {
    console.log('El servidor esta funcionando...')
})