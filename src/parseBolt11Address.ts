import * as bolt11 from 'bolt11';

interface CleanBolt11Data {
  amountSat: number;
  amountMsat: number;
  expiry: number;
  payment_hash: string;
  description: string;
  timestamp: number;
}

function parseBolt11(address: string): CleanBolt11Data | false {
  try {
    const decoded = bolt11.decode(address);

    console.log(decoded);

    // Extract sat value - use satoshis directly (already in sats, not millisats)
    const amountSat = (decoded.satoshis as number) || 0;
    const amountMsat = amountSat * 1000 || 0;

    // Extract payment_hash
    const paymentHashTag = decoded.tags?.find((tag) => tag.tagName === 'payment_hash');
    const payment_hash = (paymentHashTag?.data as string) || '';

    // Extract description
    const descriptionTag = decoded.tags?.find((tag) => tag.tagName === 'description');
    const description =
      typeof descriptionTag?.data === 'string' ? descriptionTag.data : String(descriptionTag?.data || '');

    // Extract expire_time - this is in seconds from invoice creation
    const expireTimeTag = decoded.tags?.find((tag) => tag.tagName === 'expire_time');
    const expiry = (expireTimeTag?.data as number) || 0;

    // Extract payment_hash
    const timestamp = decoded.timestamp as number;

    const cleanData: CleanBolt11Data = {
      amountSat,
      amountMsat,
      expiry,
      payment_hash,
      description,
      timestamp,
    };

    return cleanData;
  } catch (err) {
    console.log('error parsing bolt11', err);
    return false;
  }
}

export { parseBolt11 };
export type { CleanBolt11Data };
