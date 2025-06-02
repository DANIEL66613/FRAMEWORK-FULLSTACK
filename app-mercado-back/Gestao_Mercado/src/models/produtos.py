from src.extensions import db


class Produtos(db.Model):
    __tablename__ = 'produtos'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='ativo')  # Adicionei tamanho (20)
    imagem = db.Column(db.String(300), nullable=True)

    def __init__(self, nome, preco, quantidade, status='ativo', imagem=None):
        self.nome = nome
        self.preco = preco
        self.quantidade = quantidade
        self.status = status
        self.imagem = imagem