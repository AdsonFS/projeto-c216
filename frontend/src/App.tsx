import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import TodoList from './components/TodoList';
import CategoryList from './components/CategoryList';
import Dashboard from './components/Dashboard';
import './App.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <h1 className="app-title">Gerenciador de TODOs</h1>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            TODOs
          </Link>
          <Link
            to="/categories"
            className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}
          >
            Categorias
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Painel
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
