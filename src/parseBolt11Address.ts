import * as bolt11 from 'light-bolt11-decoder';

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

// Drop-in replacement for the slice of the `bolt11` package this app used:
// `.satoshis`, `.millisatoshis`, and `.tags` ([{ tagName, data }], looked up for
// 'payment_hash' and 'description').
//
// satoshis mirrors bolt11 exactly: integer sats when the msat amount is a whole
// number of sats, otherwise null (and null when the invoice omits an amount).
function decode(paymentRequest: string) {
  const { sections } = bolt11.decode(paymentRequest);

  const amount = sections.find((s) => s.name === 'amount');
  const millisatoshis = amount ? amount.value : null; // string, like bolt11
  const msat = millisatoshis == null ? null : Number(millisatoshis);
  const satoshis = msat != null && msat % 1000 === 0 ? msat / 1000 : null;

  type SectionWithValue = (typeof sections)[number] & { value: unknown };
  const tags = sections
    .filter((s): s is SectionWithValue => 'value' in s && s.value !== undefined)
    .map((s) => ({ tagName: s.name, data: s.value }));

  return { paymentRequest, satoshis, millisatoshis, tags };
}

function parseBolt11(address: string): CleanBolt11Data | false {
  try {
    const decoded = decode(address);

    const hasSatsInInvoice = !!decoded.satoshis;

    let usingSparkAddress: string | undefined = undefined;
    try {
      if (decoded.tags && Array.isArray(decoded.tags)) {
        const routingInfoTags = decoded.tags.filter(
          (item) => item && typeof item === 'object' && item.tagName === 'route_hint',
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
      // Error extracting spark address; ignore and continue
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
    const expireTimeTag = decoded.tags?.find((tag) => tag.tagName === 'expiry');
    const expiry = (expireTimeTag?.data as number) || 3600;

    // Extract timestamp
    const timestampTag = decoded.tags?.find((tag) => tag.tagName === 'timestamp');
    const timestamp = (timestampTag?.data as number) || 0;

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
    // Error extracting spark address; ignore and continue
    return false;
  }
}

export { parseBolt11 };
export type { CleanBolt11Data };
