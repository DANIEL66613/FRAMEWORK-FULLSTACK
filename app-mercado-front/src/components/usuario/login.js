import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      // Validação básica
      if (!formData.email || !formData.senha) {
        throw new Error('Preencha todos os campos');
      }

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciais inválidas');
      }

      if (!data.token) {
        throw new Error('Token não recebido');
      }

      // Armazena o token e redireciona
      localStorage.setItem('token', data.token);

      // Armazena dados do usuário se existirem
      if (data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }

      navigate('/produtos');
    } catch (error) {
      console.error('Erro no login:', error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        {erro && <div className="login-error">{erro}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={erro.includes('email') ? 'input-error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              className={erro.includes('senha') ? 'input-error' : ''}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-links">
          <a href="/cadastro">Criar nova conta</a>
          <a href="/recuperar-senha">Esqueci minha senha</a>
        </div>
      </div>
    </div>
  );
}

export default Login;