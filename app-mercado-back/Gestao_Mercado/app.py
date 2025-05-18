from flask import Flask
from flask_jwt_extended import JWTManager
from src.models.sellers import db
from flask_migrate import Migrate
from src.routes.sellersRoutes import auth_bp  
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:rootpassword@db/gestao_estoque'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret'  # Para desenvolvimento
    
    db.init_app(app)
    
    migrate = Migrate(app, db)
    
    jwt = JWTManager(app)
    
    app.register_blueprint(auth_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        db.create_all()
    
    app.run(host='0.0.0.0', port=5000)