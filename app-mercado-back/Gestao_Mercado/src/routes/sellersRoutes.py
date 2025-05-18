# routes/auth_routes.py
from flask import Blueprint, request, jsonify
from src.services.sellersService import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
auth_service = AuthService() 

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required_fields = ['nome', 'cnpj', 'email', 'celular', 'senha']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400
    
    return AuthService.register_seller(
        data['nome'],
        data['cnpj'],
        data['email'],
        data['celular'],
        data['senha']
    )

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'email' not in data or 'senha' not in data:
        return jsonify({
            'error': 'Email e senha são obrigatórios',
            'received_data': data 
        }), 400
    
    return AuthService.login(data['email'], data['senha'])

@auth_bp.route('/activate', methods=['POST'])
def activate():
    data = request.get_json()
    
    if 'email' not in data or 'codigo' not in data:
        return jsonify({'error': 'Email e código são obrigatórios'}), 400
    
    return AuthService.activate_account(data['email'], data['codigo'])