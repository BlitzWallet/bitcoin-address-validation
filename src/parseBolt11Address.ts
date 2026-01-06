import * as bolt11 from 'bolt11';

const RECEIVER_IDENTITY_PUBLIC_KEY_SHORT_CHANNEL_ID = 'f42400f424000001';

interface CleanBolt11Data {
  amountSat: number;
  amountMsat: number;
  expiry: number;
  payment_hash: string;
  description: string;
  timestamp: number;
  usingSparkAddress: string | undefined;
}

function parseBolt11(address: string): CleanBolt11Data | false {
  try {
    const decoded = bolt11.decode(address);

    const hasSatsInInvoice = !!decoded.satoshis;

    let usingSparkAddress: string | undefined = undefined;
    try {
      if (decoded.tags && Array.isArray(decoded.tags)) {
        const routingInfoTags = decoded.tags.filter(
          (item) => item && typeof item === 'object' && item.tagName === 'routing_info',
        );

        for (const tag of routingInfoTags) {
          if (tag.data && Array.isArray(tag.data) && tag.data.length > 0) {
            const firstDataItem = tag.data[0];

            if (
              firstDataItem &&
              typeof firstDataItem === 'object' &&
              'short_channel_id' in firstDataItem &&
              'pubkey' in firstDataItem
            ) {
              if (firstDataItem.short_channel_id === RECEIVER_IDENTITY_PUBLIC_KEY_SHORT_CHANNEL_ID) {
                if (typeof firstDataItem.pubkey === 'string' && firstDataItem.pubkey.length > 0) {
                  usingSparkAddress = firstDataItem.pubkey;
                  break;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.log('Error extracting spark address:', err);
    }

    // Extract sat value
    let amountSat = 0;
    let amountMsat = 0;
    if (hasSatsInInvoice) {
      amountSat =
        (typeof decoded.satoshis === 'string' ? parseInt(decoded.satoshis, 10) : (decoded.satoshis as number)) || 0;
      amountMsat = amountSat * 1000 || 0;
    } else {
      const millisRaw = decoded.millisatoshis as unknown;
      let millisNum = 0;
      if (typeof millisRaw === 'string') {
        const parsed = parseInt(millisRaw, 10);
        millisNum = Number.isNaN(parsed) ? 0 : parsed;
      } else if (typeof millisRaw === 'number') {
        millisNum = millisRaw;
      } else {
        millisNum = 0;
      }

      amountSat = Math.round((millisNum || 0) / 1000);
      amountMsat = millisNum;
    }

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

    // Extract timestamp
    const timestamp = decoded.timestamp as number;

    const cleanData: CleanBolt11Data = {
      amountSat,
      amountMsat,
      expiry,
      payment_hash,
      description,
      timestamp,
      usingSparkAddress,
    };

    return cleanData;
  } catch (err) {
    console.log('error parsing bolt11', err);
    return false;
  }
}

export { parseBolt11 };
export type { CleanBolt11Data };
