import React, { useState, useEffect } from 'react';
import './VendaProduto.css';
import { useNavigate } from 'react-router-dom';

function VendaProduto() {
  const [produtos, setProdutos] = useState([]);
  const [formData, setFormData] = useState({
    produtoId: '',
    quantidade: 1
  });
  const [carregando, setCarregando] = useState(false);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setCarregandoProdutos(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login', { state: { from: '/vender' } });
          return;
        }

        const response = await fetch('http://localhost:5000/api/produtos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar produtos');
        }

        const data = await response.json();
        setProdutos(data.filter(produto => produto.status === 'ativo'));
      } catch (error) {
        console.error('Erro:', error);
        setMensagem({
          texto: error.message || 'Erro ao carregar produtos',
          tipo: 'erro'
        });
      } finally {
        setCarregandoProdutos(false);
      }
    };

    carregarProdutos();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantidade' ? Math.max(1, parseInt(value) || 1) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.produtoId) {
      setMensagem({ texto: 'Selecione um produto', tipo: 'erro' });
      return;
    }

    try {
      setCarregando(true);
      setMensagem({ texto: '', tipo: '' });

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          produtoId: formData.produtoId,
          quantidade: formData.quantidade
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar venda');
      }

      setMensagem({
        texto: 'Venda realizada com sucesso!',
        tipo: 'sucesso'
      });
      
      // Reset form after successful sale
      setFormData({
        produtoId: '',
        quantidade: 1
      });

      // Atualiza lista de produtos (opcional)
      const produtosResponse = await fetch('http://localhost:5000/api/produtos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const produtosData = await produtosResponse.json();
      setProdutos(produtosData.filter(produto => produto.status === 'ativo'));

    } catch (error) {
      console.error('Erro:', error);
      setMensagem({
        texto: error.message || 'Erro ao realizar venda',
        tipo: 'erro'
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container-venda">
      <h2 className="titulo-venda">Registrar Venda</h2>
      
      {mensagem.texto && (
        <div className={`mensagem ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-venda">
        <div className="campo-formulario">
          <label htmlFor="produtoId">Produto*</label>
          {carregandoProdutos ? (
            <p>Carregando produtos...</p>
          ) : (
            <select
              id="produtoId"
              name="produtoId"
              value={formData.produtoId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} (Estoque: {produto.quantidade})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="campo-formulario">
          <label htmlFor="quantidade">Quantidade*</label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            min="1"
            value={formData.quantidade}
            onChange={handleChange}
            required
          />
        </div>

        <div className="acoes-formulario">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="botao-secundario"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={!formData.produtoId || carregando}
            className="botao-primario"
          >
            {carregando ? 'Processando...' : 'Registrar Venda'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VendaProduto;