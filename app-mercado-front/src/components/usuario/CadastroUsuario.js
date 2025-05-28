import "./CadastroUsuario.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const navigate = useNavigate();

  async function cadastroUser() {
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "nome" : nome,
          "cnpj" : cnpj="",
          "email" : email,
          "celular" : celular="",
          "senha" : senha="",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Cadastro realizado:", data);
        alert("Cadastro realizado com sucesso!");
        navigate("/login");
      } else {
        const erro = await response.json();
        alert("Erro ao cadastrar: " + (erro.message || "Tente novamente."));
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
      console.error(err);
    }
  }

  return (
    <div id="main">
      <form>
        <label htmlFor="nome">Nome:</label>
        <br />
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <br /><br />

        <label htmlFor="cnpj">CNPJ:</label>
        <br />
        <input
          type="text"
          id="cnpj"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
        />
        <br /><br />

        <label htmlFor="email">Email:</label>
        <br />
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <label htmlFor="celular">Celular:</label>
        <br />
        <input
          type="text"
          id="celular"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
        />
        <br /><br />

        <label htmlFor="senha">Senha:</label>
        <br />
        <input
          type="password"
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <br /><br />

        <label htmlFor="confirmarSenha">Confirmar Senha:</label>
        <br />
        <input
          type="password"
          id="confirmarSenha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />
        <br /><br />

        <input type="button" value="Cadastrar-se" onClick={cadastroUser} />
      </form>
    </div>
  );
}

export default CadastroUsuario;
