
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Familia')

const Familia = mongoose.model('familias')


router.get('/', (req, res) =>{
    res.render('admin/index')
})


router.get('/familias', (req, res) =>{
    Familia.find().sort({date:'desc'}).then((familias) =>{
        res.render('admin/familias', {familias: familias})
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
    /*
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null ){
        erros.push({text: 'Slug Invalido'})
    }
    */

    if (erros.length > 0 ){
        res.render('admin/addfamilias', {erros: erros})
    }


    const novaFamilia = {
        nome: req.body.nome
        /* slug: req.body.slug */
    }
        console.log(novaFamilia.nome);

        new Familia(novaFamilia).save().then(() =>{
        req.flash('success_msg', 'Familia Cadastrada com Sucesso')
        res.redirect('/admin/familias')
    }).catch((erro) =>{
        req.flash('error_msg', 'Houve um erro ao salvar cadastro. ' + erro)
        res.redirect('/admin')
    })
    
})


router.get('/familias/edit/:id', (req, res) =>{
    Familia.findOne({_id: req.params.id}).then((familia)=>{
        res.render('admin/editfamilias', {familia: familia});
    }).catch((erro) => {
        req.flash('error_msg', 'Esta Familia não exite' + erro)
        res.redirect('/admin/familias')
    })
    
})

router.post('/familias/edit', (req, res)=>{

    //***** Criar um sistema de validação no futuro nesta parte ******/

    Categoria.findOne({_id: req.body.id}).then((familia)=>{
        familia.nome = req.body.nome
        /* categoria.slug = req.body.slug */
    
        familia.save().then(()=>{
            req.flash('success_msg', 'Familia editada com sucesso!!')
            res.redirect('/admin/familias')
        }).catch((erro)=>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição da Familias '+ erro)
            res.redirect('/admin/familias')
        })
    }).catch((erro)=>{
        req.flash('error_msg', 'Houve um erro interno ao Editar familia '+ erro)
        res.redirect('/admin/familias')
    })
})

router.post('/familias/deletar', (req, res) =>{
    
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Familia removida com sucesso')
        res.redirect('/admin/familias')
    }).catch((erro) =>{
        req.flash('error_msg', 'Erro ao tentar remover Cadastro ' + erro)
        res.redirect('/admin/familias')
    })
})


router.get('/pedidos', (req, res)=>{
    res.render('admin/pedidos')
})

router.get('/pedidos/add', (req, res)=>{
    Familia.find().then((familias) =>{
        res.render('admin/addpedido', ({familias: familias}))    
    }).catch((erro) =>{
        req.flash('error_msg', 'Houve erro ao carregar o formulario')
        res.redirect('/admin')
    }) 
    
})

router.post('pedidos/nova', (req, res) =>{

})


module.exports = router