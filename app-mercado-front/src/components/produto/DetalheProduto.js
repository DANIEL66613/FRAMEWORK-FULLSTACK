import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalheProduto.css';

function DetalheProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!id) {
      setErro('ID do produto não foi fornecido.');
      setCarregando(false);
      return;
    }

    const fetchProduto = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const response = await fetch(`http://localhost:5000/api/products/${id}`);

        if (!response.ok) {
          throw new Error(response.status === 404
            ? 'Produto não encontrado'
            : `Erro ao carregar produto (${response.status})`);
        }

        const data = await response.json();
        setProduto(data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    fetchProduto();
  }, [id]);

  const handleEditar = () => {
    navigate(`/produtos/editar/${id}`);
  };

  if (carregando) {
    return (
      <div className="carregando">
        <div className="spinner"></div>
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="erro">
        <p>{erro}</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  if (!produto) {
    return null;
  }

  return (
    <div className="detalhe-produto">
      <div className="produto-header">
        <h2>{produto.nome}</h2>
        <div className="produto-acoes">
          <button onClick={handleEditar}>Editar</button>
          <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
      </div>

      <div className="produto-imagem">
        {produto.imagem ? (
          <img src={produto.imagem} alt={produto.nome} />
        ) : (
          <div className="sem-imagem">Sem imagem</div>
        )}
      </div>

      <div className="produto-info">
        <p><strong>Descrição:</strong> {produto.descricao || 'Não informada'}</p>
        <p><strong>Preço:</strong> R$ {Number(produto.preco).toFixed(2)}</p>
        <p><strong>Estoque:</strong> {produto.quantidade} unidades</p>
        <p><strong>Status:</strong>
          <span className={`status ${produto.status}`}>
            {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </span>
        </p>
        <p><strong>Código:</strong> {produto.id}</p>
      </div>
    </div>
  );
}

export default DetalheProduto;