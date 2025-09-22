import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header/Header';
import ChartWrapper from '../../components/Charts/ChartWrapper';
import { ChartsGrid } from '../../components/Charts/ChartStyles';
import ProjectTable from '../../components/Charts/ProjectTable';
import SalesChart from '../../components/Charts/SalesChart';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #2d3748;
  margin: 10px 0;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 14px;
  font-weight: 500;
`;

const StatChange = styled.div`
  font-size: 12px;
  color: ${props => props.isPositive ? '#38a169' : '#e53e3e'};
  margin-top: 5px;
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  margin: 30px 0 20px;
  font-size: 22px;
  font-weight: 600;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #718096;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas do dashboard
      const statsResponse = await fetch('http://localhost:5000/api/dashboard/stats');
      if (!statsResponse.ok) throw new Error('Falha ao carregar estatísticas');
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      // Buscar projetos
      const projectsResponse = await fetch('http://localhost:5000/api/dashboard/projects');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);
      } else {
        // Fallback para dados mock de projetos
        setProjects([
          {
            id: 1,
            name: 'Projeto A',
            status: 'completed',
            value: 2500.00,
            start_date: '2024-06-12',
            end_date: '2024-06-12'
          },
          {
            id: 2,
            name: 'Projeto B',
            status: 'pending',
            value: 3750.00,
            start_date: '2024-06-18',
            end_date: '2024-08-30'
          },
          {
            id: 3,
            name: 'Projeto C',
            status: 'pending',
            value: 1250.00,
            start_date: '2024-06-20',
            end_date: '2024-08-25'
          }
        ]);
      }
      
    } catch (err) {
      setError(err.message);
      // Dados de fallback para desenvolvimento
      setStats({
        total_sales: 65432,
        total_profit: 27879,
        new_users: 4364,
        active_projects: 12,
        metrics: [
          {
            title: 'Vendas',
            value: '65,432',
            change: '+12%',
            isPositive: true
          },
          {
            title: 'Lucro',
            value: '27,879',
            change: '+9%',
            isPositive: true
          },
          {
            title: 'Usuários',
            value: '+4,364',
            change: '+43%',
            isPositive: true
          },
          {
            title: 'Projetos',
            value: '12',
            change: '+2',
            isPositive: true
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <LoadingMessage>Carregando dashboard...</LoadingMessage>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard" />
      <DashboardContainer>
        {error && <ErrorMessage>Erro: {error}</ErrorMessage>}
        
        <StatsGrid>
          {stats?.metrics?.map((metric, index) => (
            <StatCard key={index}>
              <StatLabel>{metric.title}</StatLabel>
              <StatValue>{metric.value}</StatValue>
              <StatChange isPositive={metric.isPositive}>
                {metric.change} {metric.isPositive ? '↑' : '↓'}
              </StatChange>
            </StatCard>
          ))}
        </StatsGrid>
        
        <SectionTitle>Análise de Vendas</SectionTitle>
        <ChartsGrid>
          <ChartWrapper title="Distribuição de Vendas">
            <SalesChart />
          </ChartWrapper>
          
          <ChartWrapper title="Desempenho Mensal">
            <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#718096', textAlign: 'center' }}>
                Gráfico de desempenho mensal será implementado aqui
              </p>
            </div>
          </ChartWrapper>
        </ChartsGrid>
        
        <SectionTitle>Projetos Recentes</SectionTitle>
        <ProjectTable projects={projects} />
      </DashboardContainer>
    </>
  );
};

export default Dashboard;