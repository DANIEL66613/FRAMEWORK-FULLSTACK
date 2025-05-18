import "./CadastroUsuario.css";
import { useState } from "react";
function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  async function cadastroUser() {
    let api = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nome: nome,
        cnpj: "12345678000100",
        email: email,
        celular: "11999999999",
        senha: "minhasenha",
      }),
      headers:{
        'Content-Type':'application/json'
      }
    });

    if(api.ok){
        let response = await api.json()
        console.log(response)
        alert("Cadastro com sucesso!..")
        return
    }else{
        alert("Erro ao cadastrar")
    }
  }
  return (
    <div id="main">
      <form>
        <label for="nome">Nome:</label>
        <br />
        <input
          type="text"
          id="name"
          name="nome"
          onChange={(e) => setNome(e.target.value)}
        />
        <br />
        <br />

        <label for="email">Email:</label>
        <br />
       <input
          type="email"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />

        <label for="senha">Senha:</label>
        <br />
        <input type="password" id="senha" name="senha" required />
        <br />
        <br />

        <label for="confirmarSenha">Confirmar Senha:</label>
        <br />
        <input
          type="password"
          id="confirmarSenha"
          name="confirmarSenha"
          required
        />
        <br />
        <br />

        <input type="button" value="Cadastra-se" onClick={cadastroUser} />
      </form>
    </div>
  );
}

export default CadastroUsuario;
