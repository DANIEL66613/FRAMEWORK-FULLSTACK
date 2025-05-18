import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CadastroUsuario from "./components/usuario/CadastroUsuario";
import Login from "./components/usuario/login";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}></Route>
                <Route path='/cadastro-usuario' element={<CadastroUsuario />}></Route>
                <Route path='/login' element={<Login />}></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();