export function isValidBolt11(invoice: string): boolean {
  return /^ln(bc|tb|sb)\d+/.test(invoice.toLowerCase());
}

export function isValidLnurl(input: string): boolean {
  return /^lnurl[a-z0-9]+$/i.test(input);
}

export function isValidLightningAddress(input: string): boolean {
  // email-like format
  return /^[^@]+@[^@]+\.[^@]+$/.test(input);
}
