import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalheProduto.css';

function DetalheProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    // Verifica se o ID está definido
    if (!id) {
      console.error('ID do produto não foi fornecido.');
      return;
    }

    async function fetchProduto() {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        setProduto(data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      }
    }

    fetchProduto();
  }, [id]);

  if (!produto) {
    return <div>Carregando produto...</div>;
  }

  return (
    <div className="detalhe-produto">
      <h2>Detalhes do Produto</h2>
      <p><strong>Nome:</strong> {produto.nome}</p>
      <p><strong>Descrição:</strong> {produto.descricao}</p>
      <p><strong>Preço:</strong> R$ {produto.preco}</p>
      <p><strong>Estoque:</strong> {produto.estoque}</p>
      <p><strong>Status:</strong> {produto.ativo ? 'Ativo' : 'Inativo'}</p>

      <button onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
}

export default DetalheProduto;
