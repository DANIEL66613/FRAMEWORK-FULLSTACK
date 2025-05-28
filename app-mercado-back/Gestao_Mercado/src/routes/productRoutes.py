from flask import Blueprint, request, jsonify
from src.services.productsService import ProductsService

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('', methods=['POST'])
def cadastrar_produto():
    data = request.get_json()
    required_fields = ['nome', 'preco', 'quantidade']

    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    return ProductsService.cadastrar(
        data['nome'],
        data['preco'],
        data['quantidade'],
        data.get('imagem')  # imagem é opcional
    )

@products_bp.route('', methods=['GET'])
def listar_produtos():
    produtos = ProductsService.listar()
    return jsonify(produtos), 200

@products_bp.route('/<int:produto_id>', methods=['GET'])
def obter_produto(produto_id):
    return ProductsService.obter_por_id(produto_id)

@products_bp.route('/<int:produto_id>', methods=['PUT'])
def atualizar_produto(produto_id):
    data = request.get_json()
    return ProductsService.atualizar(produto_id, data)

@products_bp.route('/<int:produto_id>/inativar', methods=['PATCH'])
def inativar_produto(produto_id):
    return ProductsService.inativar(produto_id)
