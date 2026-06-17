import type { ROIResult } from '../types';
import { fmt, fmtPct } from '../utils';

interface Props {
  result: ROIResult;
  contractMonths: number;
}

export default function ResultPanel({ result, contractMonths }: Props) {
  const {
    totalRevenue, totalCost, taxAmount, admAmount, comercialAmount,
    suporteAmount, netProfit, rentability, monthlyRevenue, rawCostOverContract,
  } = result;

  const rentClass = rentability >= 0.15 ? 'kpi-good' : rentability >= 0.05 ? 'kpi-warn' : 'kpi-bad';

  return (
    <section className="card result-panel">
      <h2>Resultado — {contractMonths} meses</h2>

      <div className="kpi-grid">
        <div className="kpi">
          <span className="kpi-label">Faturamento Mensal</span>
          <span className="kpi-value">{fmt(monthlyRevenue)}</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Faturamento Total</span>
          <span className="kpi-value">{fmt(totalRevenue)}</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Custo Total</span>
          <span className="kpi-value neg">{fmt(totalCost)}</span>
        </div>
        <div className={`kpi ${netProfit >= 0 ? 'kpi-good' : 'kpi-bad'}`}>
          <span className="kpi-label">LL (Lucro Líquido)</span>
          <span className="kpi-value">{fmt(netProfit)}</span>
        </div>
        <div className={`kpi ${rentClass}`}>
          <span className="kpi-label">RENT (Rentabilidade)</span>
          <span className="kpi-value">{fmtPct(rentability)}</span>
        </div>
      </div>

      <details className="breakdown">
        <summary>Detalhamento de custos</summary>
        <table className="breakdown-table">
          <tbody>
            <tr><td>Custo Produto/Serviço</td><td className="num">{fmt(rawCostOverContract)}</td></tr>
            <tr><td>ISS</td><td className="num">{fmt(taxAmount)}</td></tr>
            <tr><td>ADM</td><td className="num">{fmt(admAmount)}</td></tr>
            <tr><td>Comercial</td><td className="num">{fmt(comercialAmount)}</td></tr>
            <tr><td>Suporte interno</td><td className="num">{fmt(suporteAmount)}</td></tr>
            <tr className="total-row"><td><strong>Total Custos</strong></td><td className="num neg"><strong>{fmt(totalCost)}</strong></td></tr>
          </tbody>
        </table>
      </details>
    </section>
  );
}
