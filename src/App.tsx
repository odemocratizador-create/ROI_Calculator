import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  LicenseItem,
  ServiceItem,
  ProjectInfo,
  TaxParams,
} from './types';
import {
  DEFAULT_CATALOG,
  CONTRACT_MONTHS_OPTIONS,
  VOLUME_DISCOUNT,
} from './types';
import { calcROI } from './calc';
import ProjectHeader from './components/ProjectHeader';
import LicenseTable from './components/LicenseTable';
import ServiceTable from './components/ServiceTable';
import TaxPanel from './components/TaxPanel';
import ResultPanel from './components/ResultPanel';
import './App.css';

const DEFAULT_TAX: TaxParams = {
  iss: 0.0565,
  adm: 0.05,
  comercial: 0.045,
  suporte: 0,
  additionalServices: 0,
};

function defaultLicense(): LicenseItem {
  const mod = DEFAULT_CATALOG[0].products[0].modules[0];
  return {
    id: uuidv4(),
    manufacturer: DEFAULT_CATALOG[0].manufacturer,
    product: DEFAULT_CATALOG[0].products[0].name,
    module: mod.name,
    quantity: 190,
    unitCost: mod.cost,
    markup: 1.7,
  };
}

function defaultService(): ServiceItem {
  return {
    id: uuidv4(),
    type: 'Serviço',
    description: 'Atividades horario comercial',
    hours: 0,
    hourlyRate: 75,
    markup: 2,
  };
}

export default function App() {
  const [project, setProject] = useState<ProjectInfo>({
    client: '',
    accountManager: '',
    flowNumber: '',
    contractMonths: 12,
  });
  const [taxes, setTaxes] = useState<TaxParams>(DEFAULT_TAX);
  const [licenses, setLicenses] = useState<LicenseItem[]>([defaultLicense()]);
  const [services, setServices] = useState<ServiceItem[]>([defaultService()]);

  const updateLicense = useCallback((id: string, field: keyof LicenseItem, value: string | number) => {
    setLicenses((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [field]: value };
        if (field === 'module') {
          const cat = DEFAULT_CATALOG.find((m) => m.manufacturer === updated.manufacturer);
          const prod = cat?.products.find((p) => p.name === updated.product);
          const mod = prod?.modules.find((m) => m.name === value);
          if (mod) updated.unitCost = mod.cost;
        }
        return updated;
      })
    );
  }, []);

  const addLicense = useCallback(() => setLicenses((p) => [...p, defaultLicense()]), []);
  const removeLicense = useCallback((id: string) => setLicenses((p) => p.filter((l) => l.id !== id)), []);

  const updateService = useCallback((id: string, field: keyof ServiceItem, value: string | number) => {
    setServices((prev) =>
      prev.map((s) => (s.id !== id ? s : { ...s, [field]: value }))
    );
  }, []);
  const addService = useCallback(() => setServices((p) => [...p, defaultService()]), []);
  const removeService = useCallback((id: string) => setServices((p) => p.filter((s) => s.id !== id)), []);

  const result = calcROI(licenses, services, project.contractMonths, taxes);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Calculadora de ROI</h1>
        <p>Precificação para Faturamento — Cibersegurança</p>
      </header>

      <main className="app-main">
        <ProjectHeader
          project={project}
          onChange={setProject}
          contractOptions={CONTRACT_MONTHS_OPTIONS}
        />

        <section className="card">
          <h2>Licenças</h2>
          <LicenseTable
            items={licenses}
            rows={result.licenseRows}
            catalog={DEFAULT_CATALOG}
            volumeDiscount={VOLUME_DISCOUNT}
            onUpdate={updateLicense}
            onAdd={addLicense}
            onRemove={removeLicense}
          />
        </section>

        <section className="card">
          <h2>Serviços de Suporte</h2>
          <ServiceTable
            items={services}
            rows={result.serviceRows}
            onUpdate={updateService}
            onAdd={addService}
            onRemove={removeService}
          />
        </section>

        <section className="card">
          <h2>Parâmetros Fiscais e Administrativos</h2>
          <TaxPanel taxes={taxes} onChange={setTaxes} />
        </section>

        <ResultPanel result={result} contractMonths={project.contractMonths} />
      </main>
    </div>
  );
}
