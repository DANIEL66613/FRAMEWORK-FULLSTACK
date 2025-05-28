import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CadastroProduto.css";

function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [status, setStatus] = useState("ativo");
  const [imagem, setImagem] = useState("");
  const navigate = useNavigate();

  async function cadastrarProduto() {
    const token = localStorage.getItem("token"); // ou sessionStorage, depende de onde você guardou

    if (!token) {
      alert("Você precisa estar logado para cadastrar um produto.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          preco: parseFloat(preco),
          quantidade: parseInt(quantidade),
          status,
          imagem,
        }),
      });

      if (response.ok) {
        await response.json();
        alert("Produto cadastrado com sucesso!");
        navigate("/produtos");
      } else {
        const erro = await response.json();
        alert("Erro ao cadastrar produto: " + (erro.message || "Tente novamente."));
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="cadastro-produto">
      <h2>Cadastrar Produto</h2>
      <form>
        <label>Nome:</label><br />
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        /><br /><br />

        <label>Preço:</label><br />
        <input
          type="number"
          step="0.01"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        /><br /><br />

        <label>Quantidade:</label><br />
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        /><br /><br />

        <label>Status:</label><br />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select><br /><br />

        <label>Imagem (URL):</label><br />
        <input
          type="text"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        /><br /><br />

        <button type="button" onClick={cadastrarProduto}>
          Cadastrar Produto
        </button>
      </form>
    </div>
  );
}

export default CadastroProduto;
