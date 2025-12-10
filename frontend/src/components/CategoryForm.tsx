import React, { useState, useEffect } from 'react';
import { CreateCategoryData, Category } from '../services/todoApi';
import './CategoryForm.css';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#007bff');

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#F4A460', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#82E0AA'
  ];

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      setColor(category.color);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    const categoryData: CreateCategoryData = {
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    };

    onSubmit(categoryData);

    // Reset form if not editing
    if (!isEditing) {
      setName('');
      setDescription('');
      setColor('#007bff');
    }
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setColor('#007bff');
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h2>

      <div className="form-group">
        <label htmlFor="name">Nome *</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome da categoria..."
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite a descrição da categoria..."
          rows={3}
          maxLength={255}
        />
      </div>

      <div className="form-group">
        <label htmlFor="color">Cor</label>
        <div className="color-picker-container">
          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-input"
          />
          <div className="predefined-colors">
            {predefinedColors.map((predefinedColor) => (
              <button
                key={predefinedColor}
                type="button"
                className={`color-option ${color === predefinedColor ? 'selected' : ''}`}
                style={{ backgroundColor: predefinedColor }}
                onClick={() => setColor(predefinedColor)}
                title={predefinedColor}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {isEditing ? 'Atualizar Categoria' : 'Adicionar Categoria'}
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

export default CategoryForm;
