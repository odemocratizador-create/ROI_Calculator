import type { ServiceItem, RowCalc } from '../types';
import { DEFAULT_SERVICE_TYPES } from '../types';
import { fmt } from '../utils';

interface Props {
  items: ServiceItem[];
  rows: RowCalc[];
  onUpdate: (id: string, field: keyof ServiceItem, value: string | number) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export default function ServiceTable({ items, rows, onUpdate, onAdd, onRemove }: Props) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Horas</th>
            <th>Valor Hora (R$)</th>
            <th>Markup</th>
            <th>Preço Hora (venda)</th>
            <th>Total</th>
            <th>Lucro Líq.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const row = rows[idx] ?? { saleUnitPrice: 0, totalCharge: 0, netProfit: 0, taxes: 0, cost: 0 };
            return (
              <tr key={item.id}>
                <td>
                  <select
                    value={item.type}
                    onChange={(e) => onUpdate(item.id, 'type', e.target.value)}
                  >
                    <option>Serviço</option>
                    <option>Consultoria</option>
                    <option>Implantação</option>
                    <option>Treinamento</option>
                  </select>
                </td>
                <td>
                  <select
                    value={item.description}
                    onChange={(e) => {
                      const preset = DEFAULT_SERVICE_TYPES.find((s) => s.description === e.target.value);
                      onUpdate(item.id, 'description', e.target.value);
                      if (preset) onUpdate(item.id, 'hourlyRate', preset.hourlyRate);
                    }}
                  >
                    {DEFAULT_SERVICE_TYPES.map((s) => (
                      <option key={s.description}>{s.description}</option>
                    ))}
                    <option value="Outro">Outro</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={item.hours}
                    onChange={(e) => onUpdate(item.id, 'hours', Number(e.target.value))}
                    className="input-sm"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.hourlyRate}
                    onChange={(e) => onUpdate(item.id, 'hourlyRate', Number(e.target.value))}
                    className="input-sm"
                  />
                </td>
                <td>
                  <div className="markup-cell">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.1}
                      value={item.markup}
                      onChange={(e) => onUpdate(item.id, 'markup', Number(e.target.value))}
                      className="slider"
                    />
                    <input
                      type="number"
                      min={1}
                      step={0.1}
                      value={item.markup}
                      onChange={(e) => onUpdate(item.id, 'markup', Number(e.target.value))}
                      className="input-xs"
                    />
                  </div>
                </td>
                <td className="num">{fmt(row.saleUnitPrice)}</td>
                <td className="num">{fmt(row.totalCharge)}</td>
                <td className={`num ${row.netProfit < 0 ? 'neg' : 'pos'}`}>{fmt(row.netProfit)}</td>
                <td>
                  <button type="button" className="btn-icon danger" onClick={() => onRemove(item.id)} title="Remover">✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button type="button" className="btn-add" onClick={onAdd}>+ Adicionar Serviço</button>
    </div>
  );
}
