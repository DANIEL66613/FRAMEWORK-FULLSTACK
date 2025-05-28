

import React, { useState, useEffect } from 'react';
import './VendaProduto.css';
import { useNavigate } from 'react-router-dom';

function VendaProduto() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/produtos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error('Erro ao buscar produtos:', err));
  }, []);

  const handleVenda = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/vender/${produtoSelecionado}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantidade }),
    })
      .then((res) => {
        if (res.ok) {
          setMensagem('Venda realizada com sucesso!');
          setProdutoSelecionado('');
          setQuantidade(1);
        } else {
          res.json().then((data) => {
            setMensagem(data.message || 'Erro ao realizar venda.');
          });
        }
      })
      .catch(() => setMensagem('Erro ao realizar venda.'));
  };

  return (
    <div className="venda-produto">
      <h2>Venda de Produto</h2>

      <label htmlFor="produto">Produto:</label>
      <select
        id="produto"
        value={produtoSelecionado}
        onChange={(e) => setProdutoSelecionado(e.target.value)}
      >
        <option value="">Selecione</option>
        {produtos.map((produto) => (
          <option key={produto.id} value={produto.id}>
            {produto.nome}
          </option>
        ))}
      </select>

      <label htmlFor="quantidade">Quantidade:</label>
      <input
        type="number"
        id="quantidade"
        min="1"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />

      <button onClick={handleVenda} disabled={!produtoSelecionado}>
        Confirmar Venda
      </button>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <button onClick={() => navigate('/')}>Voltar</button>
    </div>
  );
}

export default VendaProduto;
