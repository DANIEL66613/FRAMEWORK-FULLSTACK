from src.database import db  # Use apenas uma importação de db
from werkzeug.security import generate_password_hash
from sqlalchemy import String

class Seller(db.Model):
    __tablename__ = 'sellers'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cnpj = db.Column(db.String(14), unique=True, nullable=False)  # 14 dígitos sem máscara
    email = db.Column(db.String(120), unique=True, nullable=False)
    celular = db.Column(String(15), nullable=False)  # Removi unique=True se puder repetir
    senha = db.Column(String(200), nullable=False)
    status = db.Column(db.Integer, default=0)
    codigo_ativacao = db.Column(String(6))

    # Remova o __init__ personalizado