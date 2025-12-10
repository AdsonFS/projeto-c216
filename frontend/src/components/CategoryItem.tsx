import React from 'react';
import { Category } from '../services/todoApi';
import './CategoryItem.css';

interface CategoryItemProps {
  category: Category;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const todoCount = category.todos?.length || 0;

  return (
    <div className="category-item">
      <div className="category-header">
        <div
          className="category-color"
          style={{ backgroundColor: category.color }}
        ></div>
        <div className="category-info">
          <h3 className="category-name">{category.name}</h3>
          {category.description && (
            <p className="category-description">{category.description}</p>
          )}
          <div className="category-meta">
            <span className="category-count">{todoCount} TODO{todoCount !== 1 ? 's' : ''}</span>
            <span className="category-date">Criado: {formatDate(category.created_at)}</span>
          </div>
        </div>
      </div>
      <div className="category-actions">
        <button
          onClick={() => onEdit(category.id)}
          className="edit-btn"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="delete-btn"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default CategoryItem;
