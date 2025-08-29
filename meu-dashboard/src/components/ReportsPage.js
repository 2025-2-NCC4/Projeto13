import React from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Registrando componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f7f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h2`
  font-size: 28px;
  color: #2c3e50;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  
  button {
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    
    &:hover {
      color: #e74c3c;
    }
  }
`;

const Dashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin: 10px 0;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 14px;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 14px;
  margin-top: 5px;
  color: ${props => props.positive ? '#2ecc71' : '#e74c3c'};
`;

const ChartContainer = styled(Card)`
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 15px;
  background-color: #f8f9fa;
  color: #7f8c8d;
  font-weight: 600;
  border-bottom: 2px solid #eee;
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #eee;
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.status === 'Concluído' ? '#e7f6eb' : '#fef5e7'};
  color: ${props => props.status === 'Concluído' ? '#2ecc71' : '#f39c12'};
`;

// Dados para os gráficos
const salesData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Vendas (R$)',
      data: [6500, 5900, 8000, 8100, 5600, 6543, 7300],
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
};

const profitData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Lucro (R$)',
      data: [2000, 2200, 2500, 2300, 2600, 2788, 3000],
      backgroundColor: 'rgba(46, 204, 113, 0.7)',
    }
  ]
};

const userGrowthData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Novos Usuários',
      data: [1200, 1000, 1500, 1800, 2000, 2200, 2364],
      borderColor: '#9b59b6',
      backgroundColor: 'rgba(155, 89, 182, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
};

const categoryData = {
  labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D'],
  datasets: [
    {
      data: [30, 25, 20, 25],
      backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12'],
      hoverBackgroundColor: ['#2980b9', '#27ae60', '#c0392b', '#e67e22']
    }
  ]
};

// Opções dos gráficos
const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    }
  }
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    }
  }
};

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    }
  }
};

// Componente principal
const ReportsPage = () => {
  return (
    <Container>
      <Header>
        <PageTitle>PicMoney - Dashboard</PageTitle>
        <UserInfo>
          <button>
            <i className="fas fa-sign-out-alt"></i> Sair
          </button>
        </UserInfo>
      </Header>
      
      <Dashboard>
        <StatCard>
          <StatLabel>Vendas</StatLabel>
          <StatValue>65,432</StatValue>
          <StatChange positive>
            <i className="fas fa-arrow-up"></i> +12% este mês
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatLabel>Nicho</StatLabel>
          <StatValue>12,340</StatValue>
          <StatChange positive>
            <i className="fas fa-arrow-up"></i> +6% este mês
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatLabel>Lucro Total</StatLabel>
          <StatValue>$27,879</StatValue>
          <StatChange positive>
            <i className="fas fa-arrow-up"></i> +9% este mês
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatLabel>Usuários</StatLabel>
          <StatValue>+4,364</StatValue>
          <StatChange positive>
            <i className="fas fa-arrow-up"></i> +43% este mês
          </StatChange>
        </StatCard>
      </Dashboard>
      
      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px'}}>
        <ChartContainer>
          <ChartTitle>Vendas Mensais</ChartTitle>
          <Line data={salesData} options={lineOptions} />
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Distribuição por Categoria</ChartTitle>
          <Doughnut data={categoryData} options={doughnutOptions} />
        </ChartContainer>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
        <ChartContainer>
          <ChartTitle>Evolução de Lucros</ChartTitle>
          <Bar data={profitData} options={barOptions} />
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Crescimento de Usuários</ChartTitle>
          <Line data={userGrowthData} options={lineOptions} />
        </ChartContainer>
      </div>
      
      <Card>
        <ChartTitle>Configurações</ChartTitle>
        <Table>
          <thead>
            <tr>
              <TableHeader>Nome</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Valor</TableHeader>
              <TableHeader>Início</TableHeader>
              <TableHeader>Conclusão</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell>Projeto A</TableCell>
              <TableCell><StatusBadge status="Concluído">Concluído</StatusBadge></TableCell>
              <TableCell>R$2.500,00</TableCell>
              <TableCell>12/06/2024</TableCell>
              <TableCell>12/06/2024</TableCell>
            </tr>
            <tr>
              <TableCell>Projeto B</TableCell>
              <TableCell><StatusBadge status="Pendente">Pendente</StatusBadge></TableCell>
              <TableCell>R$3.750,00</TableCell>
              <TableCell>18/06/2024</TableCell>
              <TableCell>30/08/2024</TableCell>
            </tr>
            <tr>
              <TableCell>Projeto C</TableCell>
              <TableCell><StatusBadge status="Pendente">Pendente</StatusBadge></TableCell>
              <TableCell>R$1.250,00</TableCell>
              <TableCell>20/06/2024</TableCell>
              <TableCell>25/08/2024</TableCell>
            </tr>
            <tr>
              <TableCell>Projeto D</TableCell>
              <TableCell><StatusBadge status="Concluído">Concluído</StatusBadge></TableCell>
              <TableCell>R$5.000,00</TableCell>
              <TableCell>25/12/2024</TableCell>
              <TableCell>27/06/2025</TableCell>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default ReportsPage;