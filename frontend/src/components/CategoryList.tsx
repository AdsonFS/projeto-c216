import React, { useState, useEffect } from 'react';
import { categoryApi, Category, CreateCategoryData } from '../services/todoApi';
import CategoryForm from './CategoryForm';
import CategoryItem from './CategoryItem';
import './CategoryList.css';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [stats, setStats] = useState({ totalCategories: 0, categoriesWithTodos: 0 });

  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await categoryApi.getAll();
      setCategories(categoriesData);
    } catch (err) {
      setError('Falha ao carregar categorias. Verifique se o servidor backend está rodando.');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await categoryApi.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleCreateCategory = async (categoryData: CreateCategoryData) => {
    try {
      const newCategory = await categoryApi.create(categoryData);
      setCategories(prev => [newCategory, ...prev]);
      loadStats(); // Update stats
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Falha ao criar categoria';
      setError(errorMessage);
      console.error('Error creating category:', err);
    }
  };

  const handleUpdateCategory = async (categoryData: CreateCategoryData) => {
    if (!editingCategory) return;

    try {
      const updatedCategory = await categoryApi.update(editingCategory.id, categoryData);
      setCategories(prev => prev.map(category =>
        category.id === editingCategory.id ? updatedCategory : category
      ));
      setEditingCategory(null);
      loadStats(); // Update stats
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Falha ao atualizar categoria';
      setError(errorMessage);
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const category = categories.find(c => c.id === id);
    const todoCount = category?.todos?.length || 0;

    let confirmMessage = 'Tem certeza que deseja excluir esta categoria?';
    if (todoCount > 0) {
      confirmMessage += ` Isso removerá a categoria de ${todoCount} TODO${todoCount > 1 ? 's' : ''}.`;
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await categoryApi.delete(id);
      setCategories(prev => prev.filter(category => category.id !== id));
      loadStats(); // Update stats
    } catch (err) {
      setError('Falha ao excluir categoria');
      console.error('Error deleting category:', err);
    }
  };

  const handleEditCategory = (id: number) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setEditingCategory(category);
    }
  };

  if (loading) {
    return (
      <div className="category-list-container">
        <div className="loading">Carregando categorias...</div>
      </div>
    );
  }

  return (
    <div className="category-list-container">
      <header className="category-header">
        <h1>Gerenciamento de Categorias</h1>
        <div className="category-stats">
          <span>Total de Categorias: {stats.totalCategories}</span>
          <span>Categorias com TODOs: {stats.categoriesWithTodos}</span>
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error-btn">×</button>
        </div>
      )}

      <CategoryForm
        category={editingCategory || undefined}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        onCancel={editingCategory ? () => setEditingCategory(null) : undefined}
        isEditing={!!editingCategory}
      />

      <div className="category-list">
        {categories.length === 0 ? (
          <div className="no-categories">
            Nenhuma categoria ainda. Crie sua primeira categoria!
          </div>
        ) : (
          categories.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryList;
