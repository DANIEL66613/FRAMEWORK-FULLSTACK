import React from "react";

function CadastroUsuario() {
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

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>Cadastro de Usuário</h2>
        <form action="http://localhost:5000/users/register" method="POST">
          <div style={formGroupStyle}>
            <label htmlFor="name" style={labelStyle}>Nome:</label>
            <input type="text" id="name" name="name" required style={inputStyle} />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>E-mail:</label>
            <input type="email" id="email" name="email" required style={inputStyle} />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="cnpj" style={labelStyle}>CNPJ:</label>
            <input type="text" id="cnpj" name="cnpj" required style={inputStyle} />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>Senha:</label>
            <input type="password" id="password" name="password" required style={inputStyle} />
          </div>
          <button type="submit" style={buttonStyle}>Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default CadastroUsuario;
