const { validationResult } = require('express-validator/check');

const LivroDao = require('../infra/livro-dao'),
    db = require('../../config/database');

const templates = require('../views/templates')

class LivroControlador{

    static rotas() {
        return {
            lista: '/livros',
            cadastro: '/livros/form',
            edicao: '/livros/form/:id',
            delecao: '/livros/:id'
        };
    }


    lista() {
        return function(req, res) {
            const livroDao = new LivroDao (db);
            livroDao.lista()
            .then(livros => res.marko(
                templates.livros.lista, { livros }
            ))
            .catch(err => res.json(err))
        }
    }

    formCadastro(){
        return function(req, res) {
            res.marko( templates.livros.form, { livro: {} })
        }
    }

    formEdicao(){
        return function(req, res) {
            let id = req.params.id,
                livroDao = new LivroDao(db)
            
            livroDao.buscaPorId()
            .then(result => res.marko(
                templates.livros.form,{ livro }
            ))
            .catch(err => res.json(err))
        }
    }

    cadastra(){
        return function(req, res) {
            console.log(req.body)
            const livroDao = new LivroDao(db)
            const erros = validationResult(req)
            if(!erros.isEmpty()){
                return res.marko(
                    templates.livros.form,
                    { livro: {}, errosVal: erros.array() })
            }
            livroDao.adiciona(req.body)
            .then(res=>res.redirect('\livros'))
            .catch(erro => console.log(erro))
        }
    }

    edita(){
        return function(req, res) {
            console.log(req.body)
            const livroDao = new LivroDao(db);
            livroDao.atualiza(req.body)
            .then(res.redirect(LivroControlador.rotas().lista))
            .catch(err => console.log(err))
        }
    }

    remove(){
        return function(req, res) {
            const id = req.params.id;

            const livroDao = new LivroDao(db);
            livroDao.remove(id)
            .then(() => res.status(200).end())
            .catch(err => console.log(err))
        }
    }
}

module.exports = LivroControlador
