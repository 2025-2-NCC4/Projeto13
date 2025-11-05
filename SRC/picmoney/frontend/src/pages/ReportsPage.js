// frontend/src/pages/ReportsPage.js
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
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
`;
const PageTitle = styled.h2` font-size: 28px; color: #2c3e50; `;

const Filters = styled.div`
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  margin: 8px 0 20px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  input, button, select {
    border: 1px solid #ddd; border-radius: 8px; padding: 8px 10px;
    background: #fff; font-size: 14px;
  }
  button { cursor: pointer; }
  @media print { display: none; }
`;

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

const PALETTE = ["#3498db","#2ecc71","#e74c3c","#f39c12","#9b59b6","#1abc9c","#7f8c8d","#34495e"];
const lineOptions = { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { ticks: { callback: (v) => fmtBRL(v) } } } };
const barOptions  = { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { ticks: { callback: (v) => fmtBRL(v) } } } };
const doughnutOptions = { responsive: true, plugins: { legend: { position: 'bottom' } } };

function cleanText(s) {
  return String(s ?? '')
    .replace(/\uFFFD/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function ReportsPage() {
  const today = new Date();
  const pad2 = (x) => String(x).padStart(2, "0");
  const defaultStart = `${today.getFullYear()}-${pad2(today.getMonth()+1)}-01`;
  const defaultEnd   = `${today.getFullYear()}-${pad2(today.getMonth()+1)}-${pad2(new Date(today.getFullYear(), today.getMonth()+1, 0).getDate())}`;

  const [start, setStart] = React.useState(defaultStart);
  const [end, setEnd] = React.useState(defaultEnd);
  const [kpis, setKpis] = React.useState(null);
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [groupBy, setGroupBy] = React.useState("week"); // day | week | month
  const [availableMerchants, setAvailableMerchants] = React.useState([]);
  const [selectedMerchants, setSelectedMerchants] = React.useState([]);
  const [showMerchants, setShowMerchants] = React.useState(false);
  const exportRef = React.useRef(null);

  async function exportPDF() {
    try {
      const [{ default: html2canvas }, jsPdfModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      const jsPDF = jsPdfModule.jsPDF || jsPdfModule.default || jsPdfModule;
      const node = exportRef.current;
      if (!node) return;
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('dashboard-ceo.pdf');
    } catch (e) {
      window.print();
    }
  }

  async function load(params) {
    setLoading(true); setErr("");
    try {
      const data = params ? await api.kpisCeo(params) : await api.kpisCeo();
      setKpis(data);
      const af = data?.available_filters || {};
      setAvailableMerchants(Array.isArray(af.merchants) ? af.merchants : []);

      if (!params) {
        const keys = Object.keys(data?.receita_series || {});
        if (keys.length) {
          const min = keys[0];
          const max = keys[keys.length - 1];
          if (/^\d{4}-\d{2}$/.test(min) && /^\d{4}-\d{2}$/.test(max)) {
            const toEndDay = (ym) => {
              const [y,m] = ym.split('-').map(Number);
              const last = new Date(y, m, 0).getDate();
              return `${y}-${String(m).padStart(2,'0')}-${String(last).padStart(2,'0')}`;
            };
            setStart(`${min}-01`);
            setEnd(toEndDay(max));
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(min) && /^\d{4}-\d{2}-\d{2}$/.test(max)) {
            setStart(min);
            setEnd(max);
          } else if (/^\d{4}-W\d{2}$/.test(min) && /^\d{4}-W\d{2}$/.test(max)) {
            const weekBounds = (wk) => {
              const [yy, ww] = wk.split('-W');
              const year = Number(yy); const week = Number(ww);
              const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
              const dow = simple.getUTCDay() || 7;
              const start = new Date(simple); start.setUTCDate(simple.getUTCDate() - (dow - 1));
              const end = new Date(start); end.setUTCDate(start.getUTCDate() + 6);
              const iso = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
              return [iso(start), iso(end)];
            };
            const [sMin] = weekBounds(min); const [, eMax] = weekBounds(max);
            setStart(sMin); setEnd(eMax);
          }
        }
      }
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  const applyFilters = () => {
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;
    if (groupBy) params.group_by = groupBy;
    if (selectedMerchants.length) params.merchant = selectedMerchants.join(',');
    load(params);
  };

  const clearFilters = () => {
    setSelectedMerchants([]);
    setGroupBy('week');
    const keys = Object.keys(kpis?.receita_series || {});
    if (keys.length) {
      const min = keys[0]; const max = keys[keys.length - 1];
      if (/^\d{4}-\d{2}$/.test(min) && /^\d{4}-\d{2}$/.test(max)) {
        const toEndDay = (ym) => {
          const [y,m] = ym.split('-').map(Number);
          const last = new Date(y, m, 0).getDate();
          return `${y}-${String(m).padStart(2,'0')}-${String(last).padStart(2,'0')}`;
        };
        setStart(`${min}-01`);
        setEnd(toEndDay(max));
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(min) && /^\d{4}-\d{2}-\d{2}$/.test(max)) {
        setStart(min); setEnd(max);
      } else if (/^\d{4}-W\d{2}$/.test(min) && /^\d{4}-W\d{2}$/.test(max)) {
        const weekBounds = (wk) => {
          const [yy, ww] = wk.split('-W');
          const year = Number(yy); const week = Number(ww);
          const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
          const dow = simple.getUTCDay() || 7;
          const start = new Date(simple); start.setUTCDate(simple.getUTCDate() - (dow - 1));
          const end = new Date(start); end.setUTCDate(start.getUTCDate() + 6);
          const iso = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
          return [iso(start), iso(end)];
        };
        const [sMin] = weekBounds(min); const [, eMax] = weekBounds(max);
        setStart(sMin); setEnd(eMax);
      }
    } else {
      setStart(defaultStart); setEnd(defaultEnd);
    }
    load({ group_by: 'week' });
  };

  // datasets a partir do backend CEO
  const series = kpis?.receita_series || {};
  const periodKeys = Object.keys(series);
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const prettyLabels = periodKeys.map((k) => {
    if (groupBy === 'day' && /^\d{4}-\d{2}-\d{2}$/.test(k)) {
      const [y,m,d] = k.split('-');
      return `${d}/${m}`;
    }
    if (groupBy === 'month' && /^\d{4}-\d{2}$/.test(k)) {
      const [y,m] = k.split('-');
      return `${m}/${y.slice(2)}`;
    }
    if (groupBy === 'week' && /^\d{4}-W\d{2}$/.test(k)) {
      const [yy, ww] = k.split('-W');
      const year = Number(yy); const week = Number(ww);
      const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
      const dow = simple.getUTCDay() || 7;
      const start = new Date(simple); start.setUTCDate(simple.getUTCDate() - (dow - 1));
      const end = new Date(start); end.setUTCDate(start.getUTCDate() + 6);
      const sd = String(start.getUTCDate()).padStart(2,'0');
      const sm = monthNames[start.getUTCMonth()];
      const ed = String(end.getUTCDate()).padStart(2,'0');
      const em = monthNames[end.getUTCMonth()];
      return sm === em ? `${sd}�${ed} ${sm}` : `${sd} ${sm}�${ed} ${em}`;
    }
    return k;
  });
  const seriesValues = periodKeys.map((k) => series[k]);

  const categoria = kpis?.receita_por_categoria || {};
  const cats = Object.keys(categoria);
  const catValues = cats.map((c) => categoria[c]);
  const catColors = cats.map((_, i) => PALETTE[i % PALETTE.length]);

  const margemSeg = kpis?.margem_por_segmento || {};
  const mSegs = Object.keys(margemSeg);
  const mSegValues = mSegs.map((s) => margemSeg[s]);

  const lineMonthly = {
    labels: prettyLabels,
    datasets: [{
      label: 'Receita por Período (R$)',
      data: seriesValues,
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.12)',
      tension: 0.35,
      fill: true,
    }]
  };

  const doughnutCategorias = {
    labels: cats,
    datasets: [{
      label: 'Receita por categoria',
      data: catValues,
      backgroundColor: catColors,
      hoverBackgroundColor: catColors,
    }]
  };

  const barTopMerchants = {
    labels: kpis?.top_merchants?.labels || [],
    datasets: [{
      label: 'Top Lojas por Receita (R$)',
      data: kpis?.top_merchants?.values || [],
      backgroundColor: 'rgba(46, 204, 113, 0.70)'
    }]
  };

  const barMargemSegmento = {
    labels: mSegs,
    datasets: [{
      label: 'Margem operacional (%)',
      data: mSegValues,
      backgroundColor: 'rgba(241, 196, 15, 0.85)'
    }]
  };

  const merchantsList = availableMerchants.map((m) => ({ raw: m, label: cleanText(m) }));
  const allSelected = selectedMerchants.length === 0;

  return (
    <Container>
      <Header>
        <PageTitle>Dashboard CEO</PageTitle>
      </Header>
      <Filters>
        <label>De</label>
        <input type="date" value={start} onChange={e => setStart(e.target.value)} />
        <label>Até</label>
        <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
        <label>Granularidade</label>
        <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
          <option value="day">Diária</option>
          <option value="week">Semanal</option>
          <option value="month">Mensal</option>
        </select>

        <div style={{ position: 'relative' }}>
          <label style={{ marginRight: 6 }}>Lojas</label>
          <button type="button" onClick={() => setShowMerchants(v => !v)}>
            {allSelected ? 'Todos' : `${selectedMerchants.length} selecionadas`}
          </button>
          {showMerchants && (
            <div style={{ position: 'absolute', zIndex: 10, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, maxHeight: 260, overflowY: 'auto', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}>
              <div style={{ marginBottom: 6 }}>
                <label style={{ cursor: 'pointer' }}>
                  <input type="checkbox" checked={allSelected} onChange={() => setSelectedMerchants([])} />{' '}Todos
                </label>
              </div>
              {merchantsList.map((m) => (
                <div key={m.raw}>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedMerchants.includes(m.raw)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedMerchants((prev) => {
                          if (checked) return [...new Set([...prev, m.raw])];
                          return prev.filter(x => x !== m.raw);
                        });
                      }}
                    />{' '}
                    {m.label || '(Sem loja)'}
                  </label>
                </div>
              ))}
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <button type="button" onClick={() => setShowMerchants(false)}>Fechar</button>
              </div>
            </div>
          )}
        </div>

        <button onClick={applyFilters} disabled={loading}>Aplicar</button>
        <button onClick={clearFilters} disabled={loading}>Limpar filtros</button>
        <button onClick={exportPDF}>Exportar PDF</button>
      </Filters>
      <div ref={exportRef}>

      {err && <div style={{color: 'crimson', marginBottom: 16}}>Falha ao carregar KPIs: {err}</div>}

      <Dashboard>
        <StatCard>
          <StatLabel>Receita Total</StatLabel>
          <StatValue>{kpis ? fmtBRL(kpis.receita_total) : (loading ? '...' : 'R$ 0,00')}</StatValue>
          <StatChange positive>
            <i className="fas fa-arrow-up" /> receita bruta no período
          </StatChange>
        </StatCard>

        <StatCard>
          <StatLabel>Ticket Médio</StatLabel>
          <StatValue>{kpis ? fmtBRL(kpis.ticket_medio) : (loading ? '...' : 'R$ 0,00')}</StatValue>
          <StatChange positive>
            <i className="fas fa-receipt" /> por transação
          </StatChange>
        </StatCard>

        <StatCard>
          <StatLabel>Transações</StatLabel>
          <StatValue>{kpis ? (kpis.total_transacoes || 0).toLocaleString('pt-BR') : (loading ? '...' : '0')}</StatValue>
          <StatChange positive>
            <i className="fas fa-exchange-alt" /> período selecionado
          </StatChange>
        </StatCard>

        <StatCard>
          <StatLabel>Margem Operacional</StatLabel>
          <StatValue>{kpis ? `${(kpis.margem_operacional_percent || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%` : (loading ? '...' : '0%')}</StatValue>
          <StatChange positive={Number(kpis?.margem_operacional_percent || 0) >= 0}>
            <i className="fas fa-percentage" /> sobre a receita
          </StatChange>
        </StatCard>
      </Dashboard>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px'}}>
        <ChartContainer>
          <ChartTitle>Receita por Período ({groupBy === 'day' ? 'Diária' : groupBy === 'week' ? 'Semanal' : 'Mensal'})</ChartTitle>
          <Line data={lineMonthly} options={lineOptions} />
        </ChartContainer>
        <ChartContainer>
          <ChartTitle>Receita por Categoria</ChartTitle>
          {cats.length ? (
            <Doughnut data={doughnutCategorias} options={doughnutOptions} />
          ) : (
            <div>Sem dados…</div>
          )}
        </ChartContainer>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
        <ChartContainer>
          <ChartTitle>Top Lojas por Receita</ChartTitle>
          <Bar data={barTopMerchants} options={barOptions} />
        </ChartContainer>
        <ChartContainer>
          <ChartTitle>Margem por Segmento</ChartTitle>
          <Bar data={barMargemSegmento} options={{ ...barOptions, scales: { y: { ticks: { callback: (v) => `${v}%` } } } }} />
        </ChartContainer>
      </div>
      </div>
    </Container>
  );
}

