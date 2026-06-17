export function fmt(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function fmtPct(value: number): string {
  return (value * 100).toFixed(2) + '%';
}
