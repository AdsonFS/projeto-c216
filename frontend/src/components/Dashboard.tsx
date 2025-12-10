import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { todoApi, TodoStats } from '../services/todoApi';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await todoApi.getStats();
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar estatísticas');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Carregando estatísticas...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={loadStats} className="retry-button">
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!stats) {
    return <div className="dashboard-error">Nenhuma estatística encontrada</div>;
  }

  // Completion Rate Chart (Doughnut)
  const completionData = {
    labels: ['Concluídas', 'Pendentes'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ['#28a745', '#ffc107'],
        borderColor: ['#1e7e34', '#e0a800'],
        borderWidth: 2,
      },
    ],
  };

  // Category Distribution Chart (Bar)
  const categoryData = {
    labels: stats.categoryDistribution.map(cat => cat.categoryName),
    datasets: [
      {
        label: 'Número de TODOs',
        data: stats.categoryDistribution.map(cat => cat.count),
        backgroundColor: stats.categoryDistribution.map(cat => cat.color),
        borderColor: stats.categoryDistribution.map(cat => cat.color),
        borderWidth: 1,
      },
    ],
  };

  // Due Date Distribution Chart (Bar)
  const dueDateData = {
    labels: ['Hoje', 'Esta Semana', 'Este Mês', 'Futuro', 'Atrasadas'],
    datasets: [
      {
        label: 'Número de TODOs',
        data: [
          stats.dueDateDistribution.today,
          stats.dueDateDistribution.thisWeek,
          stats.dueDateDistribution.thisMonth,
          stats.dueDateDistribution.future,
          stats.dueDateDistribution.overdue,
        ],
        backgroundColor: [
          '#007bff', // Hoje - azul
          '#17a2b8', // Esta semana - azul claro
          '#28a745', // Este mês - verde
          '#6c757d', // Futuro - cinza
          '#dc3545', // Atrasadas - vermelho
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard - Progresso dos TODOs</h1>
        <button onClick={loadStats} className="refresh-button">
          🔄 Atualizar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <h3>Total</h3>
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">TODOs</span>
        </div>
        <div className="stat-card completed">
          <h3>Concluídas</h3>
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">TODOs</span>
        </div>
        <div className="stat-card pending">
          <h3>Pendentes</h3>
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">TODOs</span>
        </div>
        <div className="stat-card overdue">
          <h3>Atrasadas</h3>
          <span className="stat-number">{stats.overdue}</span>
          <span className="stat-label">TODOs</span>
        </div>
        <div className="stat-card completion-rate">
          <h3>Taxa de Conclusão</h3>
          <span className="stat-number">{stats.completionRate}%</span>
          <span className="stat-label">Concluídas</span>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-section">
          <h2>Status de Conclusão</h2>
          <div className="chart-wrapper">
            <Doughnut data={completionData} options={doughnutOptions} />
          </div>
        </div>

        <div className="chart-section">
          <h2>Distribuição por Categoria</h2>
          <div className="chart-wrapper">
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-section">
          <h2>TODOs por Data de Conclusão</h2>
          <div className="chart-wrapper">
            <Bar data={dueDateData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
