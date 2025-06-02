import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CadastroUsuario.css";

function CadastroUsuario() {
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
    celular: "",
    senha: "",
    confirmarSenha: ""
  });
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome) novosErros.nome = "Nome é obrigatório";
    if (!formData.email) {
      novosErros.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = "Email inválido";
    }
    if (formData.cnpj && !/^\d{14}$/.test(formData.cnpj)) {
      novosErros.cnpj = "CNPJ deve ter 14 dígitos";
    }
    if (!formData.senha) {
      novosErros.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      novosErros.senha = "Senha deve ter pelo menos 6 caracteres";
    }
    if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const formatarCelular = (celular) => {
    return celular.replace(/\D/g, '').slice(0, 11);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setCarregando(true);

      const dadosParaEnviar = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        ...(formData.cnpj && { cnpj: formData.cnpj }),
        ...(formData.celular && { celular: formatarCelular(formData.celular) })
      };

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar usuário");
      }

      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert(error.message || "Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Criar Nova Conta</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="nome">Nome Completo*</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={erros.nome ? "input-error" : ""}
          />
          {erros.nome && <span className="erro-mensagem">{erros.nome}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cnpj">CNPJ</label>
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            placeholder="Somente números"
            maxLength="14"
            className={erros.cnpj ? "input-error" : ""}
          />
          {erros.cnpj && <span className="erro-mensagem">{erros.cnpj}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={erros.email ? "input-error" : ""}
          />
          {erros.email && <span className="erro-mensagem">{erros.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="celular">Celular</label>
          <input
            type="text"
            id="celular"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha*</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className={erros.senha ? "input-error" : ""}
          />
          {erros.senha && <span className="erro-mensagem">{erros.senha}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmarSenha">Confirmar Senha*</label>
          <input
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            className={erros.confirmarSenha ? "input-error" : ""}
          />
          {erros.confirmarSenha && (
            <span className="erro-mensagem">{erros.confirmarSenha}</span>
          )}
        </div>

        <button type="submit" disabled={carregando} className="submit-button">
          {carregando ? "Cadastrando..." : "Cadastrar-se"}
        </button>
      </form>

      <div className="login-link">
        Já tem uma conta? <a href="/login">Faça login</a>
      </div>
    </div>
  );
}

export default CadastroUsuario;