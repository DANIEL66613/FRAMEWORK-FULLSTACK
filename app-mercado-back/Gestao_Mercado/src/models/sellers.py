from werkzeug.security import generate_password_hash

from werkzeug.security import generate_password_hash
from src.extensions import db

class Seller(db.Model):
    __tablename__ = 'sellers'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cnpj = db.Column(db.String(18), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    celular = db.Column(db.String(15), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)
    status = db.Column(db.Integer, default=0)
    codigo_ativacao = db.Column(db.String(6), nullable=True)

    def __init__(self, nome, cnpj, email, celular, senha, status, codigo_ativacao):
        self.nome = nome
        self.cnpj = cnpj
        self.email = email
        self.celular = celular
        self.senha = generate_password_hash(senha)
        self.status = status
        self.codigo_ativacao = codigo_ativacao