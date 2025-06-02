import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListaProdutos.css";

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const navigate = useNavigate();

  // Função para buscar produtos na API
  const fetchProdutos = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autenticação necessária");
      }

      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setErro(error.message);
      if (error.message.includes("Autenticação")) {
        navigate("/login", { state: { from: "/produtos" } });
      }
    } finally {
      setCarregando(false);
    }
  };

  // Função para alterar status do produto
  const alterarStatusProduto = async (id, novoStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Autenticação necessária");
      }

      if (!window.confirm(`Tem certeza que deseja ${novoStatus === 'inativo' ? 'inativar' : 'ativar'} este produto?`)) {
        return;
      }

      const response = await fetch(`http://localhost:5000/api/products/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: novoStatus })
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      setSucesso(`Produto ${novoStatus === 'inativo' ? 'inativado' : 'ativado'} com sucesso!`);
      setTimeout(() => setSucesso(null), 3000);
      fetchProdutos(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      setErro(error.message);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  if (carregando) {
    return (
      <div className="carregando-container">
        <div className="spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="erro-container">
        <p>Erro ao carregar produtos: {erro}</p>
        <button onClick={fetchProdutos}>Tentar novamente</button>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="sem-produtos">
        <p>Nenhum produto cadastrado.</p>
        <button onClick={() => navigate("/produtos/novo")}>Cadastrar Produto</button>
      </div>
    );
  }

  return (
    <div className="lista-produtos-container">
      <div className="cabecalho-lista">
        <h2>Lista de Produtos</h2>
        <button
          onClick={() => navigate("/produtos/novo")}
          className="botao-novo"
        >
          + Novo Produto
        </button>
      </div>

      {sucesso && <div className="mensagem-sucesso">{sucesso}</div>}

      <div className="tabela-wrapper">
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} className={produto.status === 'inativo' ? 'inativo' : ''}>
                <td>{produto.nome}</td>
                <td>R$ {produto.preco.toFixed(2)}</td>
                <td>{produto.quantidade}</td>
                <td>
                  <span className={`status-badge ${produto.status}`}>
                    {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-cell">
                  <button
                    onClick={() => navigate(`/produtos/detalhes/${produto.id}`)}
                    className="botao-acao ver"
                  >
                    👁️ Detalhes
                  </button>
                  <button
                    onClick={() => navigate(`/produtos/editar/${produto.id}`)}
                    className="botao-acao editar"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => alterarStatusProduto(
                      produto.id,
                      produto.status === 'ativo' ? 'inativo' : 'ativo'
                    )}
                    className={`botao-acao ${produto.status === 'ativo' ? 'inativar' : 'ativar'}`}
                  >
                    {produto.status === 'ativo' ? '⛔ Inativar' : '✅ Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaProdutos;