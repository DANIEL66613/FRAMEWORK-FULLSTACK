from flask import current_app
from src.models.produtos import Produtos, db

class ProductsService:
    @staticmethod
    def cadastrar(nome, preco, quantidade, imagem=None):
        try:
            novo_produto = Produtos(
                nome=nome,
                preco=preco,
                quantidade=quantidade,
                imagem=imagem
            )
            db.session.add(novo_produto)
            db.session.commit()
            return {'message': 'Produto cadastrado com sucesso', 'produto_id': novo_produto.id}, 201
        except Exception as e:
            print(e)
            db.session.rollback()
            current_app.logger.error(f'Erro ao cadastrar produto: {str(e)}')
            return {'error': 'Erro ao cadastrar produto'}, 500

    @staticmethod
    def listar():
        produtos = Produtos.query.all()
        return [
            {
                'id': p.id,
                'nome': p.nome,
                'preco': p.preco,
                'quantidade': p.quantidade,
                'status': p.status,
                'imagem': p.imagem
            }
            for p in produtos
        ]

    @staticmethod
    def obter_por_id(produto_id):
        produto = Produtos.query.get(produto_id)
        if not produto:
            return {'error': 'Produto não encontrado'}, 404

        return {
            'id': produto.id,
            'nome': produto.nome,
            'preco': produto.preco,
            'quantidade': produto.quantidade,
            'status': produto.status,
            'imagem': produto.imagem
        }, 200

    @staticmethod
    def atualizar(produto_id, dados):
        produto = Produtos.query.get(produto_id)
        if not produto:
            return {'error': 'Produto não encontrado'}, 404

        try:
            produto.nome = dados.get('nome', produto.nome)
            produto.preco = dados.get('preco', produto.preco)
            produto.quantidade = dados.get('quantidade', produto.quantidade)
            produto.status = dados.get('status', produto.status)
            produto.imagem = dados.get('imagem', produto.imagem)
            db.session.commit()
            return {'message': 'Produto atualizado com sucesso'}, 200
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Erro ao atualizar produto: {str(e)}')
            return {'error': 'Erro ao atualizar produto'}, 500

    @staticmethod
    def inativar(produto_id):
        produto = Produtos.query.get(produto_id)
        if not produto:
            return {'error': 'Produto não encontrado'}, 404

        try:
            produto.status = 'inativo'
            db.session.commit()
            return {'message': 'Produto inativado com sucesso'}, 200
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Erro ao inativar produto: {str(e)}')
            return {'error': 'Erro ao inativar produto'}, 500
