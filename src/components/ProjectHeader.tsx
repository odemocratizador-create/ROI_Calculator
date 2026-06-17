import type { ProjectInfo } from '../types';

interface Props {
  project: ProjectInfo;
  onChange: (p: ProjectInfo) => void;
  contractOptions: number[];
}

export default function ProjectHeader({ project, onChange, contractOptions }: Props) {
  const set = (field: keyof ProjectInfo, value: string | number) =>
    onChange({ ...project, [field]: value });

  return (
    <section className="card project-header">
      <h2>Dados do Projeto</h2>
      <div className="grid-2">
        <label>
          Cliente
          <input
            value={project.client}
            onChange={(e) => set('client', e.target.value)}
            placeholder="Nome do cliente"
          />
        </label>
        <label>
          Gerente de Contas
          <input
            value={project.accountManager}
            onChange={(e) => set('accountManager', e.target.value)}
            placeholder="Nome do gerente"
          />
        </label>
        <label>
          Nº do Fluxo
          <input
            value={project.flowNumber}
            onChange={(e) => set('flowNumber', e.target.value)}
            placeholder="Nº do fluxo"
          />
        </label>
        <label>
          Tempo de Contrato
          <div className="contract-months">
            {contractOptions.map((m) => (
              <button
                key={m}
                type="button"
                className={`month-btn ${project.contractMonths === m ? 'active' : ''}`}
                onClick={() => set('contractMonths', m)}
              >
                {m}m
              </button>
            ))}
            <input
              type="number"
              min={1}
              value={project.contractMonths}
              onChange={(e) => set('contractMonths', Number(e.target.value))}
              className="month-custom"
              title="Prazo personalizado em meses"
            />
          </div>
        </label>
      </div>
    </section>
  );
}
