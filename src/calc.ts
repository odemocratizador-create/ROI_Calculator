import type { LicenseItem, ServiceItem, TaxParams, RowCalc, ROIResult } from './types';

function calcRow(qty: number, unitCost: number, markup: number, taxes: TaxParams): RowCalc {
  const saleUnitPrice = unitCost * markup;
  const totalCharge = qty * saleUnitPrice;
  const taxRate = taxes.iss + taxes.adm + taxes.comercial + taxes.suporte;
  const taxAmount = totalCharge * taxRate;
  const cost = qty * unitCost;
  const netProfit = totalCharge - cost - taxAmount;
  return { saleUnitPrice, totalCharge, netProfit, taxes: taxAmount, cost };
}

export function calcROI(
  licenses: LicenseItem[],
  services: ServiceItem[],
  contractMonths: number,
  taxes: TaxParams
): ROIResult {
  const licenseRows = licenses.map((l) =>
    calcRow(l.quantity, l.unitCost, l.markup, taxes)
  );
  const serviceRows = services.map((s) =>
    calcRow(s.hours, s.hourlyRate, s.markup, taxes)
  );

  const monthlyRevenue =
    licenseRows.reduce((acc, r) => acc + r.totalCharge, 0) +
    serviceRows.reduce((acc, r) => acc + r.totalCharge, 0);

  const totalRevenue = monthlyRevenue * contractMonths;

  const licenseCostTotal = licenseRows.reduce((acc, r) => acc + r.cost, 0);
  const serviceCostTotal = serviceRows.reduce((acc, r) => acc + r.cost, 0);
  const rawCostOverContract = (licenseCostTotal + serviceCostTotal) * contractMonths;

  const taxAmount = totalRevenue * taxes.iss;
  const admAmount = totalRevenue * taxes.adm;
  const comercialAmount = totalRevenue * taxes.comercial;
  const suporteAmount = totalRevenue * taxes.suporte;

  const totalCost =
    taxAmount +
    admAmount +
    comercialAmount +
    suporteAmount +
    taxes.additionalServices +
    rawCostOverContract;

  const netProfit = totalRevenue - totalCost;
  const rentability = totalRevenue > 0 ? netProfit / totalRevenue : 0;

  return {
    monthlyRevenue,
    totalRevenue,
    totalCost,
    rawCostOverContract,
    taxAmount,
    admAmount,
    comercialAmount,
    suporteAmount,
    netProfit,
    rentability,
    licenseRows,
    serviceRows,
  };
}
