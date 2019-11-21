const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pedido = new Schema({

    nome: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true
    },
    tamanho: {
        type: String,
        require: true
    },
    familia: {
        type: Schema.Types.ObjectId,
        ref: 'familias',
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model('pedidos', Pedido)