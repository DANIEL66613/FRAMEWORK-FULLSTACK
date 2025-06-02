# Crie um script init_db.py
from src.database import db
from src.models.sellers import Seller

def reset_db():
    db.drop_all()  # Apaga todas as tabelas
    db.create_all()  # Cria novas tabelas
    print("Banco reinicializado com sucesso!")

if __name__ == '__main__':
    reset_db()