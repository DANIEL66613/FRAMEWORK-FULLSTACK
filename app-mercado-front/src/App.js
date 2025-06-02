import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            color: #333;
          }
          .app-container {
            max-width: 960px;
            margin: 40px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
          }
          h1 {
            margin-bottom: 24px;
            color: #444;
          }
          nav ul {
            display: flex;
            justify-content: center;
            gap: 24px;
            padding: 0;
            list-style: none;
            margin-bottom: 0;
          }
          nav ul li {
            margin: 0;
          }
          nav a {
            display: inline-block;
            padding: 12px 24px;
            text-decoration: none;
            font-weight: 600;
            color: #1976d2;
            border: 2px solid transparent;
            border-radius: 6px;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          nav a:hover,
          nav a:focus {
            background-color: #1976d2;
            color: white;
            border-color: #155a9c;
            outline: none;
          }
          @media (max-width: 600px) {
            nav ul {
              flex-direction: column;
              gap: 12px;
            }
          }
        `}
      </style>

      <div className="app-container">
        <h1>Bem vindo ao Gest-Stock!</h1>
        <nav>
          <ul>
            <li><Link to="/cadastro-produto">Cadastrar Produto</Link></li>
            <li><Link to="/produtos">Lista de Produtos</Link></li>
            <li><Link to="/cadastro-usuario">Cadastrar Usuário</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default App;
