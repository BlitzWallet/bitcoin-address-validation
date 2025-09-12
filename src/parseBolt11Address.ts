import * as bolt11 from 'bolt11';

interface CleanBolt11Data {
  amountSat: number;
  expire_time: number;
  payment_hash: string;
  description: string;
}

function parseBolt11(address: string): CleanBolt11Data | false {
  try {
    const decoded = bolt11.decode(address);

    // Extract sat value - use satoshis directly (already in sats, not millisats)
    const amountSat = decoded.satoshis || 0;

    // Extract payment_hash
    const paymentHashTag = decoded.tags?.find((tag) => tag.tagName === 'payment_hash');
    const payment_hash = (paymentHashTag?.data as string) || '';

    // Extract description
    const descriptionTag = decoded.tags?.find((tag) => tag.tagName === 'description');
    const description =
      typeof descriptionTag?.data === 'string' ? descriptionTag.data : String(descriptionTag?.data || '');

    // Extract expire_time - this is in seconds from invoice creation
    const expireTimeTag = decoded.tags?.find((tag) => tag.tagName === 'expire_time');
    const expire_time = (expireTimeTag?.data as number) || 0;

    const cleanData: CleanBolt11Data = {
      amountSat,
      expire_time,
      payment_hash,
      description,
    };

    return cleanData;
  } catch (err) {
    console.log('error parsing bolt11', err);
    return false;
  }
}

export { parseBolt11 };
export type { CleanBolt11Data };
