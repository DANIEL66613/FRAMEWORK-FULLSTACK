import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EdicaoProduto.css';

const EdicaoProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: ''
  });

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/produtos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduto(response.data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        alert('Erro ao carregar produto.');
      }
    };

    fetchProduto();
  }, [id]);

  const handleChange = (e) => {
    setProduto({ ...produto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/produtos/${id}`, produto, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Produto atualizado com sucesso!');
      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto.');
    }
  };

  return (
    <div className="edicao-produto">
      <h2>Editar Produto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={produto.nome}
          onChange={handleChange}
          required
        />

        <label>Descrição:</label>
        <textarea
          name="descricao"
          value={produto.descricao}
          onChange={handleChange}
          required
        />

        <label>Preço:</label>
        <input
          type="number"
          name="preco"
          value={produto.preco}
          onChange={handleChange}
          step="0.01"
          required
        />

        <label>Estoque:</label>
        <input
          type="number"
          name="estoque"
          value={produto.estoque}
          onChange={handleChange}
          required
        />

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EdicaoProduto;
