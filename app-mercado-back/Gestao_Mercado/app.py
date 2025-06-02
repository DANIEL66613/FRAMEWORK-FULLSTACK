import os
import json
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from src.database import db  # Alterado para importar de extensions
from src.routes.sellersRoutes import auth_bp
from src.routes.productRoutes import products_bp


def create_app():
    app = Flask(__name__)

    # 1. Configurações Básicas (Primeiro)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'SQLALCHEMY_DATABASE_URI',
        'mysql+pymysql://root:rootpassword@db/gestao_estoque?charset=utf8mb4'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
    app.config['TWILIO_ACCOUNT_SID'] = os.getenv('TWILIO_ACCOUNT_SID')
    app.config['TWILIO_AUTH_TOKEN'] = os.getenv('TWILIO_AUTH_TOKEN')
    app.config['TWILIO_WHATSAPP_NUMBER'] = os.getenv('TWILIO_WHATSAPP_NUMBER')

    # Configurações do CORS
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # Carrega engine_options se existirem
    engine_options = json.loads(os.getenv('SQLALCHEMY_ENGINE_OPTIONS', '{}'))
    if engine_options:
        app.config['SQLALCHEMY_ENGINE_OPTIONS'] = engine_options

    # 2. Inicializa Extensões (Depois das configurações)
    db.init_app(app)  # Importante: db deve ser inicializado antes dos blueprints
    Migrate(app, db)
    JWTManager(app)

    # 3. Registra Blueprints (Último)
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)

    # Cria tabelas apenas em desenvolvimento
    if os.getenv('FLASK_ENV') == 'development':
        with app.app_context():
            db.create_all()

    return app