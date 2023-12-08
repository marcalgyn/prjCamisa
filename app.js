// Arquivo Principal
//# Carregando Modulos
const express = require('express')
//provisorio const handlebars = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')

const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//Teste 
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');


const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
//const insecureHandlebars = allowInsecurePrototypeAccess(handlebars)                                                  


//Configurações

      //Configurar uma sessao
      //Criação e Validação de Midleware
      app.use(session({
        secret: 'camisa',
        resave: true,
        saveUninitialized: true
      }))

      app.use(flash())
      //Criação e Validação de Midleware
      app.use((req, res, next) =>{
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
      })

      //Bory Parser
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(bodyParser.json())

      //Handlebars
          //  app.engine('handlebars',  handlebars({ defaultLayout: 'main' })) 
    
    //** Removido Provisorio
    // app.engine('handlebars',  handlebars.engine({ defaultLayout: 'main' }))
    // app.set('view engine', 'handlebars')   
     

    
    app.engine('handlebars', expressHandlebars.engine({
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    }));
    app.set('view engine', 'handlebars');


   
      
               
      //Mangoose
      mongoose.Promise = global.Promise;
      mongoose.connect("mongodb://127.0.0.1/prjcamisa").then(() => {
      console.log('Conectado ao mongo..')
      }).catch((erro) => {
      console.log('Erro ao se conectar: ' + erro);
      })

      //public 
      app.use(express.static(path.join(__dirname, 'public'))) //informa o caminho absoluto dos arquivos staticos


      //Rotas
      app.use('/', admin)


      //Outros
      const PORT = 8081
      app.listen(PORT, () => {
      console.log('Servidor Rodando na porta 8081...')
      })
