import base64
import random
from datetime import datetime
from werkzeug.security import check_password_hash
from flask import current_app, json
from twilio.rest import Client
from src.models.sellers import db, Seller
from werkzeug.security import generate_password_hash

TWILIO_ACCOUNT_SID = ''
TWILIO_AUTH_TOKEN = '' 
TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'  
DESTINATION_NUMBER = 'whatsapp:+5511952473784'  

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

class AuthService:
    @staticmethod
    def register_seller(nome, cnpj, email, celular, senha):
        try:
            if len(cnpj) != 14 or not cnpj.isdigit():
                return {'error': 'CNPJ deve ter 14 dígitos numéricos'}, 400

            if Seller.query.filter_by(email=email).first():
                return {'error': 'Email já cadastrado'}, 400
            
            if Seller.query.filter_by(cnpj=cnpj).first():
                return {'error': 'CNPJ já cadastrado'}, 400

            
            codigo = f"{random.randint(0, 9999):04d}"

            novo_vendedor = Seller(
                nome=nome,
                cnpj=cnpj,
                email=email,
                celular=celular,
                senha=generate_password_hash(senha),
                codigo_ativacao=codigo,
                status=0
            )
            
            try:
                message = twilio_client.messages.create(
                    from_=TWILIO_WHATSAPP_NUMBER,
                    body=f'\U0001F511 Código de ativação para {nome[:15]}...: {codigo}\n'
                         f'⏳ Válido por 10 minutos\n'
                         f'📋 CNPJ: {cnpj}',
                    to=DESTINATION_NUMBER
                )
                current_app.logger.info(f'WhatsApp enviado. SID: {message.sid}')
            except Exception as e:
                current_app.logger.error(f'Falha no WhatsApp: {str(e)}')
            
            db.session.add(novo_vendedor)
            db.session.commit()

            return {
                'message': 'Cadastro realizado.',
                'codigo': codigo  
            }, 201
        
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Erro no cadastro: {str(e)}')
            return {'error': 'Falha no processo de cadastro'}, 500
        
    @staticmethod
    def _generate_simple_token(seller):
        token_data = {
            'seller_id': seller.id,
            'email': seller.email,
            'generated_at': str(datetime.now())
        }
        return base64.b64encode(json.dumps(token_data).encode()).decode()

    @staticmethod
    def login(email, senha):
        seller = Seller.query.filter_by(email=email).first()
        
        if not seller:
            return {'error': 'Credenciais inválidas'}, 401
        
        if not check_password_hash(seller.senha, senha):
            return {'error': 'Credenciais inválidas'}, 401
        
        if seller.status == 0:
            return {
                'error': 'Conta inativa',
                'solution': 'Por favor, ative sua conta com o código de ativação'
            }, 403
        
        token = AuthService._generate_simple_token(seller)
        
        return {
            'token': token,
            'seller_id': seller.id,
            'nome': seller.nome,
            'email': seller.email
        }, 200

    @staticmethod
    def activate_account(email, codigo):
        seller = Seller.query.filter_by(email=email).first()
        
        if not seller:
            return {'error': 'Email não encontrado'}, 404
        
        if seller.status == 1:
            return {'error': 'Conta já ativada'}, 400
        
        if seller.codigo_ativacao != codigo:
            return {'error': 'Código de ativação inválido'}, 400
        
        seller.status = 1
        seller.codigo_ativacao = None
        db.session.commit()
        
        return {'message': 'Conta ativada com sucesso'}, 200