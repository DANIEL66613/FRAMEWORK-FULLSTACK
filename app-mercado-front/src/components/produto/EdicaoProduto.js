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
    quantidade: '',
    status: 'ativo',
    imagem: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        setCarregando(true);
        setErro('');

        const token = localStorage.getItem('token');
        if (!token) throw new Error('Acesso não autorizado');

        const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setProduto({
          nome: response.data.nome,
          descricao: response.data.descricao || '',
          preco: response.data.preco.toString(),
          quantidade: response.data.quantidade.toString(),
          status: response.data.status || 'ativo',
          imagem: response.data.imagem || ''
        });
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        setErro(error.response?.data?.message ||
               error.message ||
               'Erro ao carregar produto');
      } finally {
        setCarregando(false);
      }
    };

    carregarProduto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setEnviando(true);
      setErro('');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Acesso não autorizado');

      // Validações
      if (!produto.nome || !produto.preco || !produto.quantidade) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      const dadosAtualizados = {
        ...produto,
        preco: parseFloat(produto.preco),
        quantidade: parseInt(produto.quantidade)
      };

      await axios.put(`http://localhost:5000/api/products/${id}`, dadosAtualizados, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Produto atualizado com sucesso!');
      navigate(`/produtos/detalhes/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setErro(error.response?.data?.message ||
             error.message ||
             'Erro ao atualizar produto');
    } finally {
      setEnviando(false);
    }
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
      <div className="erro-container">
        <p className="erro-mensagem">{erro}</p>
        <button
          onClick={() => navigate('/produtos')}
          className="botao-voltar"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="edicao-produto-container">
      <h2 className="titulo-edicao">Editar Produto</h2>

      <form onSubmit={handleSubmit} className="formulario-edicao">
        <div className="campo-formulario">
          <label htmlFor="nome">Nome*:</label>
          <input
            id="nome"
            type="text"
            name="nome"
            value={produto.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo-formulario">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            value={produto.descricao}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="campos-duplos">
          <div className="campo-formulario">
            <label htmlFor="preco">Preço*:</label>
            <input
              id="preco"
              type="number"
              name="preco"
              value={produto.preco}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="quantidade">Quantidade*:</label>
            <input
              id="quantidade"
              type="number"
              name="quantidade"
              value={produto.quantidade}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="campo-formulario">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={produto.status}
            onChange={handleChange}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className="campo-formulario">
          <label htmlFor="imagem">URL da Imagem:</label>
          <input
            id="imagem"
            type="text"
            name="imagem"
            value={produto.imagem}
            onChange={handleChange}
          />
          {produto.imagem && (
            <div className="preview-imagem">
              <img src={produto.imagem} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <div className="acoes-formulario">
          <button
            type="button"
            onClick={() => navigate(`/produtos/detalhes/${id}`)}
            className="botao-secundario"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="botao-primario"
          >
            {enviando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EdicaoProduto;