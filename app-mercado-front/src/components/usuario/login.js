import React from 'react';

function Login() {
  return (
    <div id="login">
      <form action="/login" method="POST">
        <h2>Login</h2>

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="senha">Senha:</label>
        <input type="password" id="senha" name="senha" required />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
