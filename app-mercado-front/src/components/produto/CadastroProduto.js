import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CadastroProduto.css";

function CadastroProduto() {
  // Estados unificados em um único objeto para melhor organização
  const [produto, setProduto] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    status: "ativo",
    imagem: ""
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  // Manipula mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function cadastrarProduto(e) {
    e.preventDefault(); // Previne recarregamento da página
    setCarregando(true);
    setErro("");

    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Você precisa estar logado para cadastrar um produto.");
      setCarregando(false);
      return;
    }

    try {
      // Validações básicas
      if (!produto.nome || !produto.preco || !produto.quantidade) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...produto,
          preco: parseFloat(produto.preco),
          quantidade: parseInt(produto.quantidade)
        })
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.message || "Erro ao cadastrar produto");
      }

      // Sucesso no cadastro
      alert("Produto cadastrado com sucesso!");
      navigate("/produtos");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setErro(error.message || "Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-produto">
      <h2>Cadastrar Produto</h2>

      {erro && <div className="erro-mensagem">{erro}</div>}

      <form onSubmit={cadastrarProduto}>
        <label>Nome:*</label>
        <input
          type="text"
          name="nome"
          value={produto.nome}
          onChange={handleChange}
          required
        />

        <label>Preço:*</label>
        <input
          type="number"
          name="preco"
          step="0.01"
          min="0"
          value={produto.preco}
          onChange={handleChange}
          required
        />

        <label>Quantidade:*</label>
        <input
          type="number"
          name="quantidade"
          min="0"
          value={produto.quantidade}
          onChange={handleChange}
          required
        />

        <label>Status:</label>
        <select
          name="status"
          value={produto.status}
          onChange={handleChange}
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>

        <label>Imagem (URL):</label>
        <input
          type="text"
          name="imagem"
          value={produto.imagem}
          onChange={handleChange}
        />

        <button type="submit" disabled={carregando}>
          {carregando ? "Cadastrando..." : "Cadastrar Produto"}
        </button>
      </form>
    </div>
  );
}

export default CadastroProduto;