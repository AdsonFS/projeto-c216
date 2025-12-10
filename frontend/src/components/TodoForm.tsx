import React, { useState, useEffect } from 'react';
import { CreateTodoData, Todo, Category, categoryApi } from '../services/todoApi';
import './TodoForm.css';

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (data: CreateTodoData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onSubmit, onCancel, isEditing = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setCompleted(todo.completed);
      setDueDate(todo.dueDate ? todo.dueDate.slice(0, 16) : ''); // Format for datetime-local input
      setSelectedCategoryIds(todo.categories?.map(cat => cat.id) || []);
    }
  }, [todo]);

  const loadCategories = async () => {
    try {
      const categories = await categoryApi.getAll();
      setAvailableCategories(categories);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const todoData: CreateTodoData = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed,
      dueDate: dueDate || undefined,
      categoryIds: selectedCategoryIds,
    };

    onSubmit(todoData);

    // Reset form if not editing
    if (!isEditing) {
      setTitle('');
      setDescription('');
      setCompleted(false);
      setDueDate('');
      setSelectedCategoryIds([]);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCompleted(false);
    setDueDate('');
    setSelectedCategoryIds([]);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Editar TODO' : 'Adicionar Novo TODO'}</h2>

      <div className="form-group">
        <label htmlFor="title">Título *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título do todo..."
          maxLength={255}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite a descrição do todo..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Data de Conclusão</label>
        <input
          type="datetime-local"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Marcar como concluído
        </label>
      </div>

      <div className="form-group">
        <label>Categorias</label>
        {loadingCategories ? (
          <div className="categories-loading">Carregando categorias...</div>
        ) : availableCategories.length === 0 ? (
          <div className="no-categories-message">
            Nenhuma categoria disponível. <a href="/categories">Crie algumas categorias</a> primeiro.
          </div>
        ) : (
          <div className="categories-selection">
            {availableCategories.map(category => (
              <label key={category.id} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                <span
                  className="category-color-indicator"
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className="category-name">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {isEditing ? 'Atualizar TODO' : 'Adicionar TODO'}
        </button>
        {isEditing && onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancelar
          </button>
        )}
        {!isEditing && (
          <button type="button" onClick={handleReset} className="reset-btn">
            Limpar
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
