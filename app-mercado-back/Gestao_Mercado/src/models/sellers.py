from src.database import db
from werkzeug.security import generate_password_hash
from sqlalchemy import String

class Seller(db.Model):
    __tablename__ = 'sellers'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cnpj = db.Column(db.String(14), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    celular = db.Column(String(15), nullable=False)
    senha = db.Column(String(200), nullable=False)
    status = db.Column(db.Integer, default=0)
    codigo_ativacao = db.Column(String(6))