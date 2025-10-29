import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  // Dados para o gráfico de pizza (Donut)
  const pieData = {
    labels: ['Vendas Diretas', 'Vendas Online', 'Vendas em Loja'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: [
          '#4299e1',
          '#48bb78', 
          '#ed8936',
        ],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite controlar o aspect ratio
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: 'Distribuição de Vendas',
        font: {
          size: 12
        }
      },
    },
    cutout: '60%',
  };

  // Dados para o gráfico de barras
  const barData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Vendas 2024',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: '#4299e1',
        borderRadius: 3,
        barThickness: 12, // Barras mais finas
      },
      {
        label: 'Vendas 2023',
        data: [45, 49, 60, 71, 46, 45],
        backgroundColor: '#a0aec0',
        borderRadius: 3,
        barThickness: 12, // Barras mais finas
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: 'Desempenho Mensal',
        font: {
          size: 12
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 9
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 9
          }
        }
      },
    },
  };


};

export default SalesChart;