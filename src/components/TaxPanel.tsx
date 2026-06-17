import type { TaxParams } from '../types';

interface Props {
  taxes: TaxParams;
  onChange: (t: TaxParams) => void;
}

type Field = keyof TaxParams;

const FIELDS: { key: Field; label: string; description: string }[] = [
  { key: 'iss', label: 'ISS (tomando crédito PIS/Cofins)', description: 'Imposto Sobre Serviços' },
  { key: 'adm', label: 'ADM', description: 'Taxa administrativa' },
  { key: 'comercial', label: 'Comercial', description: 'Custo comercial' },
  { key: 'suporte', label: 'Suporte', description: 'Custo de suporte interno' },
  { key: 'additionalServices', label: 'Serviços Adicionais (R$)', description: 'Valor fixo de serviços adicionais' },
];

export default function TaxPanel({ taxes, onChange }: Props) {
  const set = (key: Field, value: number) => onChange({ ...taxes, [key]: value });

  return (
    <div className="tax-grid">
      {FIELDS.map(({ key, label, description }) => {
        const isFixed = key === 'additionalServices';
        const val = taxes[key];
        return (
          <label key={key} className="tax-item" title={description}>
            <span>{label}</span>
            <div className="tax-inputs">
              <input
                type="number"
                min={0}
                step={isFixed ? 1 : 0.001}
                value={isFixed ? val : +(val * 100).toFixed(3)}
                onChange={(e) =>
                  set(key, isFixed ? Number(e.target.value) : Number(e.target.value) / 100)
                }
                className="input-sm"
              />
              {!isFixed && <span className="unit">%</span>}
            </div>
          </label>
        );
      })}
    </div>
  );
}
