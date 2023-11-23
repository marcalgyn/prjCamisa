
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Familia')
const Familia = mongoose.model('familias')

require('../models/Pedido')
const Pedido = mongoose.model('pedidos')

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');



router.get('/', (req, res) =>{
   res.render('admin/index') 
   /*  Provisorio
   res.redirect('/pedidos/add')
   */
    
})


router.get('/familias', (req, res) =>{
    Familia.find().sort({nome:'desc'}).then((familias) =>{
        //res.render('admin/familias', {familias: familias})
        res.render('admin/familias', {
            familias: familias.map(familia => familia.toJSON() )})
    }).catch((erro) =>{
        req.flash('error_msg', 'Ouve erro ao tentar listar Familias' + erro)
    })
})

router.get('/familias/add', (req, res) =>{
    res.render('admin/addfamilias')
})


router.post('/familias/nova', (req, res) =>{
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
        erros.push({text: 'Nome Invalido'})

    } else {
        if (req.body.nome.length < 2 ){
            erros.push({text: 'Nome da Familia muito pequeno'})
        }
    }

    
    if (erros.length > 0 ){
        res.render('./addfamilias', {erros: erros})
        
    }


    const novaFamilia = {
        nome: req.body.nome
        /* slug: req.body.slug */
    }
        console.log(novaFamilia.nome);

        new Familia(novaFamilia).save().then(() =>{
        req.flash('success_msg', 'Familia Cadastrada com Sucesso')
        res.redirect('/familias')
    }).catch((erro) =>{
        req.flash('error_msg', 'Houve um erro ao salvar cadastro. ' + erro)
        res.redirect('/familias/add')
    })
    
})


router.get('/familias/edit/:id', (req, res) =>{
    Familia.findOne({_id: req.params.id}).then((familia)=>{
        res.render('admin/editfamilias', {familia: familia});

    }).catch((erro) => {
        req.flash('error_msg', 'Esta Familia não exite' + erro)
        res.redirect('/admin/familias..')
    })
    
})

router.post('/familias/edit', (req, res)=>{

    //***** Criar um sistema de validação no futuro nesta parte ******/
console.log("_id", req.body.id)
console.log("retorno ID", req.body.id)

    Familia.findOne({_id: req.body.id}).then((familia)=>{
        familia.nome = req.body.nome
        /* categoria.slug = req.body.slug */
    
        familia.save().then(()=>{
            req.flash('success_msg', 'Familia editada com sucesso!!')
            res.redirect('/familias')
        }).catch((erro)=>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição da Familias '+ erro)
            res.redirect('/familias')
        })
    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro interno ao Editar familia '+ erro)
        res.redirect('/familias')
    })
})

router.post('/familias/deletar', (req, res) =>{
    
    //Familia.remove({_id: req.body.id}).then(()=>{
    Familia.deleteOne({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Familia removida com sucesso')
        res.redirect('/familias')
    }).catch((erro) =>{
        req.flash('error_msg', 'Erro ao tentar remover Cadastro ' + erro)
        res.redirect('/familias')
    })
})




router.get('/pedidos', (req, res)=>{

    Pedido.find().populate('familia').then((pedidos) =>{
        //res.render('admin/pedidos', {pedidos: pedidos})
        res.render('admin/pedidos', {
            pedidos: pedidos.map(pedido => pedido.toJSON() )})

    }).catch((erro) =>{
        req.flash('error_msg', 'Ouve erro ao tentar listar Pedidos. ' + erro)
        res.render('admin/pedidos')
    })


})

router.get('/pedidos/add', (req, res)=>{
    Familia.find().then((familias) =>{
       // res.render('admin/addpedido', ({familias: familias}))    
       res.render('admin/addpedido', {
        familias: familias.map(familia => familia.toJSON() )})

    }).catch((erro) =>{
        req.flash('error_msg', 'Houve erro ao carregar o formulario')
        res.redirect('/')
    }) 
    
})

router.post('/pedidos/nova', (req, res) =>{
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
        erros.push({text: 'Nome Invalido'})

    } else {
        if (req.body.nome.length < 2 ){
            erros.push({text: 'Nome da Familia muito pequeno'})
        }
    }

    if (erros.length > 0) {
        res.render('./addpedido', {erros: erros})
    }

    const novoPedido = {
        nome: req.body.nome,
        tamanho: req.body.tamanho,
        familia: req.body.familia
    }
        console.log('Familia e: ' + req.body.familia)
    new Pedido(novoPedido).save().then(() =>{
        req.flash('success_msg', 'Pedido Cadastrado com sucesso')
        res.redirect('/pedidos')
    }).catch((erro) =>{
        req.flash('erro_msg', 'Houve um erro ao salvar cadastro')
        res.redirect('/pedidos/add')
    })


})
/* Apagar cadastro de Pedidos*/
router.post('/pedidos/deletar', (req, res) =>{
    
    Pedido.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Pedido removido com sucesso')
        res.redirect('/pedidos')
    }).catch((erro) =>{
        req.flash('error_msg', 'Erro ao tentar remover Cadastro ' + erro)
        res.redirect('/pedidos')
    })
})

router.get('/pedidos/edit/:id', (req, res) =>{
    
    Pedido.findOne({_id: req.params.id}).populate('familia').then((pedido)=>{
        
        Familia.find().then((familia) => {
            res.render('admin/editpedidos', {pedido: pedido, familia: familia}); 

        })
        
    }).catch((erro) => {
        req.flash('error_msg', 'Esta Pedido não exite' + erro)
        res.redirect('/admin/pedidos')
    })
    
})

/* Salva edição Cadastro de Pedidos*/
router.post('/pedidos/edit', (req, res)=>{

    //***** Criar um sistema de validação no futuro nesta parte ******/
    

    Pedido.findOne({_id: req.body.id}).then((pedido)=>{
        pedido.nome = req.body.nome,
        pedido.tamanho = req.body.tamanho,
        pedido.familia = req.body.familia
        
        pedido.save().then(()=>{
            req.flash('success_msg', 'Pedido editado com sucesso!!')
            res.redirect('/pedidos')
        }).catch((erro)=>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição do Pedido '+ erro)
            res.redirect('/pedidos')
        })
    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro interno ao Editar Pedido '+ erro)
        res.redirect('/pedidos')
    })
})

//Visualizar Registro Familia
router.get("/vis-familia/:id", (req, res) => {

    Famnilia.findOne({ _id: req.params.id }).then((familia) => {
        res.render("admin/vis-familia", { familia: familia })
    }).catch((erro) => {
        req.flash('error_msg', 'Familia nao Encontrada ')
        res.redirect('/admin/familia')
    })

})




module.exports = router