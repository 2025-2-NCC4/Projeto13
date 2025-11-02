import React from "react";
import styled from "styled-components";
import {
  Chart as ChartJS, CategoryScale, LinearScale, ArcElement, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { api } from "../services/api";


ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend
);

/* ===== styled ===== */
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
const Filters = styled.div`
  display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
  input, button {
    border: 1px solid #ddd; border-radius: 8px; padding: 8px 10px;
    background: #fff; font-size: 14px;
  }
  button { cursor: pointer; }
`;
const Dashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  align-items: stretch;
`;
const Card = styled.div`
  background: white; border-radius: 12px; padding: 18px 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
`;
const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 110px;
  padding: 16px 10px;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
`;
const StatValue = styled.div`
  font-size: clamp(1.6rem, 1.8vw, 2rem);
  font-weight: 700;
  color: #2c3e50;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 90%;
`;
const StatLabel = styled.div` color: #7f8c8d; font-size: 14px; `;
const ChartsGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
`;
const ChartContainer = styled(Card)``;
const ChartTitle = styled.h3`
  color: #2c3e50; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;
`;



/* ===== helpers ===== */
const fmtBRL = (n) =>
  (typeof n === "number" ? n : Number(n || 0))
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

const fmtPCT = (n) =>
  (typeof n === "number" ? n : Number(n || 0))
    .toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + "%";

function calcTicketMedioClient(receitaPorCat, txPorCat) {
  if (!receitaPorCat || !txPorCat) return null;
  const out = {};
  for (const cat of Object.keys(receitaPorCat)) {
    const rec = Number(receitaPorCat[cat] || 0);
    const tx  = Number(txPorCat[cat] || 0);
    out[cat] = tx > 0 ? Math.round((rec / tx) * 100) / 100 : 0;
  }
  return out;
}

const PALETTE = [
  "#3498db","#2ecc71","#e74c3c","#f39c12"
];

export default function CFODashboard() {
  const today = new Date();
  const pad2 = (x) => String(x).padStart(2, "0");
  const defaultStart = `${today.getFullYear()}-${pad2(today.getMonth()+1)}-01`;
  const defaultEnd   = `${today.getFullYear()}-${pad2(today.getMonth()+1)}-${pad2(new Date(today.getFullYear(), today.getMonth()+1, 0).getDate())}`;

  const [start, setStart] = React.useState(defaultStart);
  const [end, setEnd] = React.useState(defaultEnd);
  const [kpis, setKpis] = React.useState(null);
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function load(params) {
    setLoading(true); setErr("");
    try {
      const data = params ? await api.kpisCfo(params) : await api.kpisCfo();
      setKpis(data);

      // se foi a 1ª carga (sem params), ajuste o período para o range real
      if (!params) {
        const months = Object.keys(data?.receita_liquida_mensal || {});
        if (months.length) {
          const min = months[0];
          const max = months[months.length - 1];
          const firstDay = `${min}-01`;
          const [y, m] = max.split("-").map(Number);
          const lastDay = `${max}-${String(new Date(y, m, 0).getDate()).padStart(2, "0")}`;
          setStart(firstDay);
          setEnd(lastDay);
        }
      }
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  // primeira carga: sem filtro (descobre meses disponíveis)
  React.useEffect(() => { load(); }, []);

  /* ===== datasets seguros ===== */
  const rlMensalLabels = Object.keys(kpis?.receita_liquida_mensal || {});
  const rlMensalValues = Object.values(kpis?.receita_liquida_mensal || {});

  // <<< AQUI definimos lineData >>>
  const lineData = {
    labels: rlMensalLabels,
    datasets: rlMensalLabels.length
      ? [{
          label: "Receita Líquida (R$)",
          data: rlMensalValues,
          fill: true,
          borderColor: "#2D9CDB",
          backgroundColor: "rgba(45,156,219,0.15)",
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.35,
        }]
      : []
  };

  const ticketMap = kpis?.ticket_medio_por_segmento
    || (kpis ? calcTicketMedioClient(kpis?.receita_por_categoria, kpis?.transacoes_por_categoria) : null)
    || {};
  const ticketLabels = Object.keys(ticketMap);
  const ticketValues = Object.values(ticketMap);
  const colors = ticketLabels.map((_, i) => PALETTE[i % PALETTE.length]);

  const barData = {
    labels: ticketLabels,
    datasets: ticketLabels.length
      ? [{
          label: "Ticket Médio (R$)",
          data: ticketValues,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
          borderRadius: 8,
        }]
      : []
  };

    // ===== Volume de Transações por Segmento =====
  // Mapa recebido do backend: { categoria: contagem }
  const volumeMap = kpis?.transacoes_por_categoria || {};

  // Ordena do maior para o menor para uma leitura executiva
  const volumeEntries = Object.entries(volumeMap).sort((a, b) => b[1] - a[1]);
  const volumeLabels = volumeEntries.map(([cat]) => cat);
  const volumeValues = volumeEntries.map(([, v]) => v);

  const volumeColors = volumeLabels.map((_, i) => PALETTE[i % PALETTE.length]);

  const volumeBarData = {
    labels: volumeLabels,
    datasets: volumeLabels.length
      ? [{
          label: "Total de Transações",
          data: volumeValues,
          backgroundColor: volumeColors,
          borderColor: volumeColors,
          borderWidth: 1,
          borderRadius: 8,
        }]
      : []
  };

  const volumeBarOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${Number(ctx.parsed.x).toLocaleString("pt-BR")} transações`,
        },
      },
    },
    scales: {
      x: {
        ticks: { callback: (v) => Number(v).toLocaleString("pt-BR") },
        grid: { color: "rgba(0,0,0,0.06)" },
        title: { display: true, text: "Quantidade de Transações" },
      },
      y: { grid: { display: false } },
    },
  };


  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { callbacks: { label: (ctx) => ` ${fmtBRL(ctx.parsed.y)}` } },
    },
    scales: {
      y: { ticks: { callback: (v) => fmtBRL(v) }, grid: { color: "rgba(0,0,0,0.06)" } },
      x: { grid: { display: false } },
    },
  };

  const barOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${fmtBRL(ctx.parsed.x)}` } },
    },
    scales: {
      x: { ticks: { callback: (v) => fmtBRL(v) }, grid: { color: "rgba(0,0,0,0.06)" } },
      y: { grid: { display: false } },
    },
  };

  // ===== Margem Operacional por Segmento =====
const margemMap = kpis?.margem_por_segmento || {}; // {categoria: percent}
const margemEntries = Object.entries(margemMap).sort((a, b) => b[1] - a[1]);
const margemLabels = margemEntries.map(([cat]) => cat);
const margemValues = margemEntries.map(([, v]) => Number(v) || 0);

// Cores por intensidade (verde bom, vermelho ruim)
const margemColors = margemValues.map((v) => {
  if (v >= 40) return "rgba(34,197,94,0.85)";    // verde forte
  if (v >= 25) return "rgba(132,204,22,0.85)";   // verde médio
  if (v >= 15) return "rgba(234,179,8,0.85)";    // amarelo
  if (v >= 5)  return "rgba(249,115,22,0.85)";   // laranja
  return "rgba(239,68,68,0.85)";                 // vermelho
});

const margemBarData = {
  labels: margemLabels,
  datasets: margemLabels.length
    ? [{
        label: "Margem Operacional (%)",
        data: margemValues,
        backgroundColor: margemColors,
        borderColor: margemColors.map(c => c.replace("0.85", "1")),
        borderWidth: 1,
        borderRadius: 8,
      }]
    : []
};

const margemBarOptions = {
  indexAxis: "y",
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.x.toFixed(2)}%`,
      },
    },
    title: { display: false },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        callback: (v) => `${v}%`,
      },
      grid: { color: "rgba(0,0,0,0.06)" },
      title: { display: true, text: "Margem (%)" },
    },
    y: { grid: { display: false } },
  },
};

    // ===== Estrutura de Custos (Fixos vs Variáveis vs Operacionais) =====
const custosMap = kpis?.estrutura_custos || {}; // {Fixos: num, Variáveis: num, Operacionais: num}
const custosEntries = Object.entries(custosMap).filter(([, v]) => Number(v) > 0);
const custosLabels = custosEntries.map(([k]) => k);
const custosValues = custosEntries.map(([, v]) => Number(v));
const custosColors = custosLabels.map((_, i) => PALETTE[i % PALETTE.length]);

const custosData = {
  labels: custosLabels,
  datasets: [{
    label: "Participação no Custo Total",
    data: custosValues,
    backgroundColor: custosColors.map(c => c.replace("#", "#") ),
    borderColor: "#ffffff",
    borderWidth: 2,
  }]
};

const custosOptions = {
  responsive: true,
  maintainAspectRatio: false, // IMPORTANTE: permite controle pelo container
  cutout: "60%",
  plugins: {
    legend: { 
      position: "right",
      labels: {
        boxWidth: 12,
        padding: 15,
        font: { size: 12 }
      }
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const total = custosValues.reduce((a, b) => a + b, 0);
          const v = Number(ctx.parsed) || 0;
          const pct = total ? (v / total) * 100 : 0;
          return ` ${v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (${pct.toFixed(1)}%)`;
        }
      }
    },
  },
};



  return (
    <Container>
      <Header>
        <PageTitle>PicMoney – CFO (Financeiro)</PageTitle>
        <Filters>
          <input type="date" value={start} onChange={(e)=>setStart(e.target.value)} />
          <input type="date" value={end} onChange={(e)=>setEnd(e.target.value)} />
          <button onClick={() => load({ start, end })}>Aplicar</button>
        </Filters>
      </Header>

      {err && <div style={{color: 'crimson', marginBottom: 16}}>Erro: {err}</div>}
      {loading && <div style={{marginBottom: 16}}>Carregando…</div>}

      <Dashboard>
        <StatCard><StatLabel>Receita Total</StatLabel><StatValue>{kpis ? fmtBRL(kpis.receita_total) : "…"}</StatValue></StatCard>
        <StatCard><StatLabel>Repasse Total</StatLabel><StatValue>{kpis ? fmtBRL(kpis.repasse_total) : "…"}</StatValue></StatCard>
        <StatCard><StatLabel>Receita Líquida</StatLabel><StatValue>{kpis ? fmtBRL(kpis.receita_liquida) : "…"}</StatValue></StatCard>
        <StatCard><StatLabel>Margem Operacional</StatLabel><StatValue>{kpis ? fmtPCT(kpis.margem_operacional_percent) : "…"}</StatValue></StatCard>
        <StatCard><StatLabel>Ticket Médio</StatLabel><StatValue>{kpis ? fmtBRL(kpis.ticket_medio) : "…"}</StatValue></StatCard>
        <StatCard><StatLabel>Tx. Repasse</StatLabel><StatValue>{kpis ? fmtPCT(kpis.taxa_repasse_percent) : "…"}</StatValue></StatCard>
      </Dashboard>

      <ChartsGrid>
        <ChartContainer style={{ height: "400px" }}>
          <ChartTitle>Volume de Transações por Segmento</ChartTitle>
          {kpis && volumeBarData.datasets.length > 0
            ? <Bar data={volumeBarData} options={volumeBarOptions} />
            : <div>Sem dados…</div>}
        </ChartContainer>

          <ChartContainer style={{ height: "400px" }}>
          <ChartTitle>Ticket Médio por Segmento</ChartTitle>
          {kpis && barData.datasets.length > 0
            ? <Bar data={barData} options={barOptions} />
            : <div>Sem dados…</div>}
        </ChartContainer>

          <ChartContainer style={{ 
            height: "410px", 
            display: "flex", 
            flexDirection: "column",
            paddingTop: "8px",
          }}>
            <ChartTitle style={{ marginBottom: "8px" }}>Estrutura de Custos (Fixos vs. Variáveis)</ChartTitle>
            {kpis && custosValues.length > 0 ? (
              <div style={{ 
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                height: "100%"
              }}>
                <div style={{ 
                  width: "100%", 
                  maxWidth: "500px",
                  height: "300px"
                }}>
                  <Doughnut data={custosData} options={custosOptions} />
                </div>
              </div>
            ) : (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                flex: 1 
              }}>
                Sem dados…
              </div>
            )}
          </ChartContainer>


          <ChartContainer style={{ height: "400px" }}>
          <ChartTitle>Margem Operacional por Segmento</ChartTitle>
          {kpis && margemBarData.datasets.length > 0
            ? <Bar data={margemBarData} options={margemBarOptions} />
            : <div>Sem dados…</div>}
        </ChartContainer>

      </ChartsGrid>
    </Container>
  );
}
