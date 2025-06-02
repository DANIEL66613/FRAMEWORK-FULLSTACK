import sys
from pathlib import Path
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import text
from src.extensions import db
from src.routes.sellersRoutes import auth_bp
from src.routes.productRoutes import products_bp
import json
import os


# Adiciona o diretório src ao PATH (opcional, só se necessário)
sys.path.append(str(Path(__file__).parent / "src"))



def create_app():
    app = Flask(__name__)

    # Configurações (mantidas como estão)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    engine_options = json.loads(os.getenv('SQLALCHEMY_ENGINE_OPTIONS', '{}'))
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = engine_options
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:rootpassword@db/gestao_estoque?charset=utf8mb4'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret'  # Recomendo usar variáveis de ambiente

    # Inicializações
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)  # Atribua a uma variável se for usar callbacks

    # Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)

    # Cria tabelas se não existirem (apenas para desenvolvimento)
    with app.app_context():
        db.create_all()

    return app