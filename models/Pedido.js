const mongoose = require('mongoose')
const Schemma = mongoose.Schema

const Pedido = new Schemma({

    nome: {
        type: String,
        require: true
    },
   /* slug: {
        type: String,
        require: true
    },
    */
    descricao: {
        type: String,
        require: true
    },
    tamanho: {
        type: String,
        require: true
    },
    familia: {
        type: Schema.types.ObjectId,
        ref: 'familias',
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model('pedidos', Pedido)