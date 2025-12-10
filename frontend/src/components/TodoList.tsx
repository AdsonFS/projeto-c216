import React, { useState, useEffect } from 'react';
import { todoApi, Todo, CreateTodoData } from '../services/todoApi';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const todosData = await todoApi.getAll();
      setTodos(todosData);
    } catch (err) {
      setError('Falha ao carregar todos. Verifique se o servidor backend está rodando.');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData: CreateTodoData) => {
    try {
      const newTodo = await todoApi.create(todoData);
      setTodos(prev => [newTodo, ...prev]);
    } catch (err) {
      setError('Falha ao criar todo');
      console.error('Error creating todo:', err);
    }
  };

  const handleUpdateTodo = async (todoData: CreateTodoData) => {
    if (!editingTodo) return;

    try {
      const updatedTodo = await todoApi.update(editingTodo.id, todoData);
      setTodos(prev => prev.map(todo =>
        todo.id === editingTodo.id ? updatedTodo : todo
      ));
      setEditingTodo(null);
    } catch (err) {
      setError('Falha ao atualizar todo');
      console.error('Error updating todo:', err);
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      const updatedTodo = await todoApi.toggleComplete(id);
      setTodos(prev => prev.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('Falha ao alternar status do todo');
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este todo?')) {
      return;
    }

    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Falha ao excluir todo');
      console.error('Error deleting todo:', err);
    }
  };

  const handleEditTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setEditingTodo(todo);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const todoStats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  if (loading) {
    return (
      <div className="todo-list-container">
        <div className="loading">Carregando todos...</div>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <header className="todo-header">
        <h1>Minha Lista de TODOs</h1>
        <div className="todo-stats">
          <span>Total: {todoStats.total}</span>
          <span>Ativos: {todoStats.active}</span>
          <span>Concluídos: {todoStats.completed}</span>
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={loadTodos} className="retry-btn">Tentar Novamente</button>
        </div>
      )}

      <TodoForm
        todo={editingTodo || undefined}
        onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
        onCancel={editingTodo ? () => setEditingTodo(null) : undefined}
        isEditing={!!editingTodo}
      />

      <div className="todo-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Ativos
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Concluídos
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="no-todos">
            {filter === 'all' ? 'Nenhum todo ainda. Crie seu primeiro todo!' :
              filter === 'active' ? 'Nenhum todo ativo!' :
                'Nenhum todo concluído!'}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
