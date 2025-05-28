import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListaProdutos.css";

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar produtos na API
  async function fetchProdutos() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para ver os produtos.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProdutos(data);
      } else {
        alert("Erro ao carregar produtos.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  // Função para inativar o produto
  async function inativarProduto(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para inativar produtos.");
      navigate("/login");
      return;
    }

    if (!window.confirm("Tem certeza que deseja inativar este produto?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/produtos/${id}/inativar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Produto inativado com sucesso.");
        fetchProdutos(); // atualiza lista
      } else {
        alert("Erro ao inativar produto.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  if (loading) return <p>Carregando produtos...</p>;

  if (produtos.length === 0) return <p>Nenhum produto cadastrado.</p>;

  return (
    <div className="lista-produtos">
      <h2>Produtos</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>R$ {produto.preco.toFixed(2)}</td>
              <td>{produto.quantidade}</td>
              <td>{produto.status}</td>
              <td>
                <button onClick={() => navigate(`/produtos/detalhes/${produto.id}`)}>Ver</button>
                <button onClick={() => navigate(`/produtos/editar/${produto.id}`)}>Editar</button>
                {produto.status === "ativo" && (
                  <button onClick={() => inativarProduto(produto.id)}>Inativar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaProdutos;
