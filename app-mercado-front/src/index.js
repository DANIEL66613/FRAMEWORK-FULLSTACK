   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import './index.css';
   import App from './App';
   import reportWebVitals from './reportWebVitals';
   import { BrowserRouter, Routes, Route } from 'react-router-dom';

   import CadastroUsuario from './components/usuario/CadastroUsuario';
   import Login from './components/usuario/login';
   import CadastroProduto from './components/produto/CadastroProduto';
   import ListaProdutos from './components/produto/ListaProdutos';  
   import DetalheProduto from './components/produto/DetalheProduto';
   import EdicaoProduto from './components/produto/EdicaoProduto'; // Importação do componente de edição

   const root = ReactDOM.createRoot(document.getElementById('root'));
   root.render(
     <React.StrictMode>
       <BrowserRouter>
         <Routes>
           <Route path='/' element={<App />} />
           <Route path='/cadastro-usuario' element={<CadastroUsuario />} />
           <Route path='/cadastro-produto' element={<CadastroProduto />} />
           <Route path='/login' element={<Login />} />
           <Route path='/produtos' element={<ListaProdutos />} />
           <Route path='/produtos/detalhes/:id' element={<DetalheProduto />} />
           <Route path='/produtos/editar/:id' element={<EdicaoProduto />} /> {/* Rota de edição */}
         </Routes>
       </BrowserRouter>
     </React.StrictMode>
   );

   reportWebVitals();
   