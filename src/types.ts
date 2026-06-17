export interface LicenseItem {
  id: string;
  manufacturer: string;
  product: string;
  module: string;
  quantity: number;
  unitCost: number;
  markup: number;
}

export interface ServiceItem {
  id: string;
  type: string;
  description: string;
  hours: number;
  hourlyRate: number;
  markup: number;
}

export interface ProjectInfo {
  client: string;
  accountManager: string;
  flowNumber: string;
  contractMonths: number;
}

export interface TaxParams {
  iss: number;
  adm: number;
  comercial: number;
  suporte: number;
  additionalServices: number;
}

export interface RowCalc {
  saleUnitPrice: number;
  totalCharge: number;
  netProfit: number;
  taxes: number;
  cost: number;
}

export interface ROIResult {
  monthlyRevenue: number;
  totalRevenue: number;
  totalCost: number;
  rawCostOverContract: number;
  taxAmount: number;
  admAmount: number;
  comercialAmount: number;
  suporteAmount: number;
  netProfit: number;
  rentability: number;
  licenseRows: RowCalc[];
  serviceRows: RowCalc[];
}

export const VOLUME_DISCOUNT: { max: number; discount: number }[] = [
  { max: 99, discount: 0.2 },
  { max: 999, discount: 0.1 },
  { max: Infinity, discount: 0.05 },
];

export const DEFAULT_CATALOG: {
  manufacturer: string;
  products: { name: string; modules: { name: string; cost: number }[] }[];
}[] = [
  {
    manufacturer: 'IBM',
    products: [
      {
        name: 'MaaS360',
        modules: [
          { name: 'Essentials', cost: 17.87 },
          { name: 'TeamViewer', cost: 2.96 },
        ],
      },
    ],
  },
];

export const DEFAULT_SERVICE_TYPES = [
  { type: 'Serviço', description: 'Atividades horario comercial', hourlyRate: 75 },
  { type: 'Serviço', description: 'Atividades fora do horario comercial', hourlyRate: 150 },
];

export const CONTRACT_MONTHS_OPTIONS = [12, 24, 36, 48, 60];
