import React from 'react';
import { Todo } from '../services/todoApi';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isLightColor = (hexColor: string): boolean => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-header">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="todo-checkbox"
          />
          <h3 className={`todo-title ${todo.completed ? 'line-through' : ''}`}>
            {todo.title}
          </h3>
        </div>
        {todo.description && (
          <p className={`todo-description ${todo.completed ? 'line-through' : ''}`}>
            {todo.description}
          </p>
        )}
        {todo.categories && todo.categories.length > 0 && (
          <div className="todo-categories">
            {todo.categories.map(category => (
              <span
                key={category.id}
                className="category-tag"
                style={{
                  backgroundColor: category.color,
                  color: isLightColor(category.color) ? '#333' : '#fff'
                }}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
        <div className="todo-meta">
          <span className="todo-date">Created: {formatDate(todo.created_at)}</span>
          {todo.updated_at !== todo.created_at && (
            <span className="todo-date">Updated: {formatDate(todo.updated_at)}</span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button
          onClick={() => onEdit(todo.id)}
          className="edit-btn"
          disabled={todo.completed}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
