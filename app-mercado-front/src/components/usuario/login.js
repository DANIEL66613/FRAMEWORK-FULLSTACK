import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          localStorage.setItem('token', data.token);
          alert('Login realizado com sucesso!');
          navigate('/produtos');
        } else {
          alert('Token não recebido. Verifique a resposta do servidor.');
        }
      } else {
        const error = await response.json();
        alert('Erro no login: ' + (error.message || 'Verifique suas credenciais.'));
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Erro ao conectar com o servidor.');
    }
  }

  return (
    <div id="login">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="senha">Senha:</label>
        <input
          type="password"
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;

