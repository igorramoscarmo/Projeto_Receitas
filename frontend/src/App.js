// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import authService from './services/authService';
import PesquisaPage from './views/PesquisaPage';
import HomePage from './views/HomePage';
import UserManagementPage from './views/UserManagementPage';
import NovaReceitaPage from './views/NovaReceitaPage';
import ReceitasManagementPage from './views/ReceitasManagementPage';
import ReceitaDetalhesPage from './views/ReceitaDetalhesPage';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="pattern-header"></div>
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/pesquisa" element={<PesquisaPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/admin/users" element={<UserManagementPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/admin/receitas" element={<ReceitasManagementPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/admin/nova-receita" element={<NovaReceitaPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/receita/:id" element={<ReceitaDetalhesPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;