import type { LicenseItem, RowCalc } from '../types';
import { fmt } from '../utils';

interface CatalogModule { name: string; cost: number }
interface CatalogProduct { name: string; modules: CatalogModule[] }
interface CatalogEntry { manufacturer: string; products: CatalogProduct[] }

interface Props {
  items: LicenseItem[];
  rows: RowCalc[];
  catalog: CatalogEntry[];
  volumeDiscount: { max: number; discount: number }[];
  onUpdate: (id: string, field: keyof LicenseItem, value: string | number) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

function getVolumeLabel(qty: number, table: { max: number; discount: number }[]): string {
  const tier = table.find((t) => qty <= t.max);
  if (!tier) return '';
  return `Desconto referência: ${(tier.discount * 100).toFixed(0)}%`;
}

export default function LicenseTable({ items, rows, catalog, volumeDiscount, onUpdate, onAdd, onRemove }: Props) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Fabricante</th>
            <th>Produto</th>
            <th>Módulo</th>
            <th>Qtd</th>
            <th>Custo Unit. (R$)</th>
            <th>Markup</th>
            <th>Preço Venda Unit.</th>
            <th>Total Mensal</th>
            <th>Lucro Líq. (mês)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const row = rows[idx] ?? { saleUnitPrice: 0, totalCharge: 0, netProfit: 0, taxes: 0, cost: 0 };
            const cat = catalog.find((c) => c.manufacturer === item.manufacturer);
            const prod = cat?.products.find((p) => p.name === item.product);
            return (
              <tr key={item.id}>
                <td>
                  <select
                    value={item.manufacturer}
                    onChange={(e) => onUpdate(item.id, 'manufacturer', e.target.value)}
                  >
                    {catalog.map((c) => (
                      <option key={c.manufacturer}>{c.manufacturer}</option>
                    ))}
                    <option value="__custom">Outro...</option>
                  </select>
                </td>
                <td>
                  {cat ? (
                    <select
                      value={item.product}
                      onChange={(e) => onUpdate(item.id, 'product', e.target.value)}
                    >
                      {cat.products.map((p) => (
                        <option key={p.name}>{p.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={item.product}
                      onChange={(e) => onUpdate(item.id, 'product', e.target.value)}
                      placeholder="Produto"
                    />
                  )}
                </td>
                <td>
                  {prod ? (
                    <select
                      value={item.module}
                      onChange={(e) => onUpdate(item.id, 'module', e.target.value)}
                    >
                      {prod.modules.map((m) => (
                        <option key={m.name}>{m.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={item.module}
                      onChange={(e) => onUpdate(item.id, 'module', e.target.value)}
                      placeholder="Módulo"
                    />
                  )}
                </td>
                <td>
                  <div className="qty-cell">
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) => onUpdate(item.id, 'quantity', Number(e.target.value))}
                      className="input-sm"
                    />
                    <span className="vol-hint">{getVolumeLabel(item.quantity, volumeDiscount)}</span>
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitCost}
                    onChange={(e) => onUpdate(item.id, 'unitCost', Number(e.target.value))}
                    className="input-sm"
                  />
                </td>
                <td>
                  <div className="markup-cell">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.05}
                      value={item.markup}
                      onChange={(e) => onUpdate(item.id, 'markup', Number(e.target.value))}
                      className="slider"
                    />
                    <input
                      type="number"
                      min={1}
                      step={0.05}
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
      <button type="button" className="btn-add" onClick={onAdd}>+ Adicionar Licença</button>
    </div>
  );
}
