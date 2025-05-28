from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from src.extensions import db
from src.routes.sellersRoutes import auth_bp  
from src.routes.productRoutes import products_bp

def create_app():
    app = Flask(__name__)
    
    # Configurar CORS de forma explícita
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:rootpassword@db/gestao_estoque'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret'
    
    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    
    return app
