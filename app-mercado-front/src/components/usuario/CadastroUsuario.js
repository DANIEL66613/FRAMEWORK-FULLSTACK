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
  const [etapa, setEtapa] = useState("cadastro"); // 'cadastro' ou 'verificacao'
  const [codigoVerificacao, setCodigoVerificacao] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (etapa === "cadastro") {
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          // Muda para a etapa de verificação para mostrar a tela do código
          setEtapa("verificacao");
        } else {
          alert(data.error || 'Erro no cadastro');
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    } else if (etapa === "verificacao") {
      try {
        setCarregando(true);

        const response = await fetch("http://localhost:5000/api/auth/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            codigo: codigoVerificacao
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Código inválido ou expirado");
        }

        alert("Conta ativada com sucesso! Faça login para continuar.");
        navigate("/login");
      } catch (error) {
        console.error("Erro na verificação:", error);
        alert(error.message || "Código inválido ou expirado");
      } finally {
        setCarregando(false);
      }
    }
  };

  return (
    <div className="cadastro-container">
      <h2>{etapa === "cadastro" ? "Criar Nova Conta" : "Verificar Conta"}</h2>

      {etapa === "cadastro" ? (
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
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="codigoVerificacao">Código de Verificação</label>
            <input
              type="text"
              id="codigoVerificacao"
              name="codigoVerificacao"
              value={codigoVerificacao}
              onChange={(e) => setCodigoVerificacao(e.target.value)}
              placeholder="Digite o código recebido via WhatsApp"
            />
            <small>Verifique seu WhatsApp (+{formData.celular})</small>
          </div>

          <button type="submit" disabled={carregando} className="submit-button">
            {carregando ? "Verificando..." : "Verificar Código"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setEtapa("cadastro")}
          >
            Voltar
          </button>
        </form>
      )}

      <div className="login-link">
        Já tem uma conta? <a href="/login">Faça login</a>
      </div>
    </div>
  );
}

export default CadastroUsuario;

