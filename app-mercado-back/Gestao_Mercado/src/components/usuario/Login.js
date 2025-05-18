import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    background: "#f4f4f4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const boxStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
  };

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Login bem-sucedido:", data);
        // redirecionar, salvar token, etc.
      } else {
        const errorData = await res.json();
        alert("Erro: " + errorData.message);
      }
    } catch (error) {
      alert("Erro ao fazer login.");
      console.error(error);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>E-mail:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;