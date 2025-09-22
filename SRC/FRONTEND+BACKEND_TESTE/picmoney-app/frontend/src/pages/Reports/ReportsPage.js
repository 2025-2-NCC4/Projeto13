import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header/Header';
import ChartWrapper from '../../components/Charts/ChartWrapper';
import { ChartsGrid } from '../../components/Charts/ChartStyles';


const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const FilterSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #2980b9;
  }
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

const ReportsPage = () => {
  const [salesData, setSalesData] = useState(null);
  const [profitData, setProfitData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchReportsData();
  }, [period]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados de vendas
      const salesResponse = await fetch(`http://localhost:5000/api/reports/sales?period=${period}`);
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setSalesData(salesData.data);
      }
      
      // Buscar dados de lucro
      const profitResponse = await fetch(`http://localhost:5000/api/reports/profit?period=${period}`);
      if (profitResponse.ok) {
        const profitData = await profitResponse.json();
        setProfitData(profitData.data);
      }
      
      // Buscar dados de usuários
      const usersResponse = await fetch(`http://localhost:5000/api/reports/users?period=${period}`);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsersData(usersData.data);
      }
      
    } catch (err) {
      setError(err.message);
      // Dados de fallback
      setSalesData({
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        datasets: [{
          label: 'Vendas 2024',
          data: [6500, 5900, 8000, 8100, 5600, 6543, 7300],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)'
        }]
      });
      
      setProfitData({
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        datasets: [{
          label: 'Lucro 2024',
          data: [2000, 2200, 2500, 2300, 2600, 2788, 3000],
          backgroundColor: 'rgba(46, 204, 113, 0.7)'
        }]
      });
      
      setUsersData({
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        datasets: [{
          label: 'Novos Usuários',
          data: [1200, 1000, 1500, 1800, 2000, 2200, 2364],
          borderColor: '#9b59b6',
          backgroundColor: 'rgba(155, 89, 182, 0.1)'
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Relatórios" />
        <LoadingMessage>Carregando relatórios...</LoadingMessage>
      </>
    );
  }

  return (
    <>
      <Header title="Relatórios" />
      <Container>
        <Title>Relatórios PicMoney</Title>
        
        {error && <ErrorMessage>Erro: {error}</ErrorMessage>}
        
        <FilterSection>
          <h3>Filtros</h3>
          <FilterGroup>
            <div>
              <label>Período: </label>
              <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </Select>
            </div>
            <Button onClick={fetchReportsData}>
              Atualizar Relatórios
            </Button>
          </FilterGroup>
        </FilterSection>
        
        <ChartsGrid>
          <ChartWrapper title="Relatório de Vendas">
            {salesData ? (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Gráfico de vendas carregado</p>
              </div>
            ) : (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#718096' }}>Dados de vendas não disponíveis</p>
              </div>
            )}
          </ChartWrapper>
          
          <ChartWrapper title="Relatório de Lucros">
            {profitData ? (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Gráfico de lucros carregado</p>
              </div>
            ) : (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#718096' }}>Dados de lucros não disponíveis</p>
              </div>
            )}
          </ChartWrapper>
        </ChartsGrid>
        
        <ChartsGrid>
          <ChartWrapper title="Crescimento de Usuários">
            {usersData ? (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Gráfico de usuários carregado</p>
              </div>
            ) : (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#718096' }}>Dados de usuários não disponíveis</p>
              </div>
            )}
          </ChartWrapper>
          
          <ChartWrapper title="Resumo Financeiro">
            <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#718096', textAlign: 'center' }}>
                Resumo financeiro detalhado será exibido aqui
              </p>
            </div>
          </ChartWrapper>
        </ChartsGrid>
      </Container>
    </>
  );
};

export default ReportsPage;