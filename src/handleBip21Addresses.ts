import { decode } from 'bip21';
interface Bip21Options {
  amount?: number;
  label?: string;
  message?: string;
  lightning?: string;
}

function parseBip21Addressess(address: string, prefix: string) {
  try {
    const decoded = decode(address, prefix);
    return decoded as { address: string; options: Bip21Options };
  } catch (err) {
    console.log('error parsing bip21', err);
    return false;
  }
}

export { parseBip21Addressess };
export type { Bip21Options };
