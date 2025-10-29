// frontend/src/pages/ReportsPage.jsx
import React from "react";
import styled from "styled-components";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { api } from "../services/api";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, ArcElement
);

const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f7f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
`;
const PageTitle = styled.h2` font-size: 28px; color: #2c3e50; `;

const Dashboard = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px; margin-bottom: 40px;
`;
const Card = styled.div`
  background: white; border-radius: 10px; padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
const StatCard = styled(Card)` text-align: center; `;
const StatValue = styled.div` font-size: 32px; font-weight: bold; color: #2c3e50; margin: 10px 0; `;
const StatLabel = styled.div` color: #7f8c8d; font-size: 14px; `;
const StatChange = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 5px;
  font-size: 14px; margin-top: 5px; color: ${p => p.positive ? '#2ecc71' : '#e74c3c'};
`;
const ChartContainer = styled(Card)` margin-bottom: 20px; `;
const ChartTitle = styled.h3`
  color: #2c3e50; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;
`;

// helper para formatar moeda
const fmtBRL = (n) =>
  (typeof n === "number" ? n : Number(n || 0))
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

// dados estáticos dos gráficos (pode trocar depois para endpoints reais)
const salesData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
  datasets: [{ label: 'Vendas (R$)', data: [6500, 5900, 8000, 8100, 5600, 6543, 7300],
    borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)', tension: 0.4, fill: true }]
};
const profitData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
  datasets: [{ label: 'Lucro (R$)', data: [2000, 2200, 2500, 2300, 2600, 2788, 3000],
    backgroundColor: 'rgba(46, 204, 113, 0.7)' }]
};
const userGrowthData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
  datasets: [{ label: 'Novos Usuários', data: [1200, 1000, 1500, 1800, 2000, 2200, 2364],
    borderColor: '#9b59b6', backgroundColor: 'rgba(155, 89, 182, 0.1)', tension: 0.4, fill: true }]
};
const categoryData = {
  labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D'],
  datasets: [{ data: [30, 25, 20, 25],
    backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12'],
    hoverBackgroundColor: ['#2980b9', '#27ae60', '#c0392b', '#e67e22'] }]
};
const lineOptions = { responsive: true, plugins: { legend: { position: 'top' } } };
const barOptions  = { responsive: true, plugins: { legend: { position: 'top' } } };
const doughnutOptions = { responsive: true, plugins: { legend: { position: 'bottom' } } };

export default function ReportsPage() {
  const [kpis, setKpis] = React.useState(null);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    api.kpisSummary()
      .then((data) => { if (mounted) setKpis(data); })
      .catch((e) => { if (mounted) setErr(e.message); });
    return () => { mounted = false; };
  }, []);

  return (
    <Container>
      <Header>
        <PageTitle>PicMoney - Dashboard</PageTitle>
      </Header>

      {err && <div style={{color: 'crimson', marginBottom: 16}}>Falha ao carregar KPIs: {err}</div>}

      <Dashboard>
        <StatCard>
          <StatLabel>Receita Total</StatLabel>
          <StatValue>{kpis ? fmtBRL(kpis.receita_total) : "..."}</StatValue>
          <StatChange positive>
            <i className="fas fa-arrow-up" /> {/* placeholder */}
            baseado em {kpis?.base_col || "—"}
          </StatChange>
        </StatCard>

        <StatCard>
          <StatLabel>Ticket Médio</StatLabel>
          <StatValue>{kpis ? fmtBRL(kpis.ticket_medio) : "..."}</StatValue>
          <StatChange positive={!(kpis?.ticket_medio_estimado)}>
            {kpis?.ticket_medio_estimado ? "estimado pelas lojas" : "real por transações"}
          </StatChange>
        </StatCard>

        <StatCard>
          <StatLabel>Clientes Únicos</StatLabel>
          <StatValue>{kpis ? kpis.clientes_unicos.toLocaleString("pt-BR") : "..."}</StatValue>
          <StatChange positive><i className="fas fa-user" /> total distintos</StatChange>
        </StatCard>

        <StatCard>
          <StatLabel>Lojas Únicas</StatLabel>
          <StatValue>{kpis ? kpis.lojas_unicas.toLocaleString("pt-BR") : "..."}</StatValue>
          <StatChange positive><i className="fas fa-store" /> base merchants</StatChange>
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
    </Container>
  );
}
