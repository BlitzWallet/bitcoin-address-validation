import { parseBolt11 } from './parseBolt11Address.js';
import { parseLNURL } from './parseLNURLAddress.js';
async function parseLightningAddress(address: string) {
  try {
    const isBolt11 = parseBolt11(address);
    if (isBolt11) {
      return {
        type: 'bolt11Address',
        data: {
          ...isBolt11,
          address: address,
        },
      };
    }
  } catch (err) {
    // not a bolt11, fall through to LNURL parsing
  }

  try {
    const isLNURL = await parseLNURL(address);

    if (isLNURL) {
      return {
        ...isLNURL,
        data: {
          ...isLNURL.data,
          address: address,
        },
      };
    }
  } catch (err) {
    console.log('error parsing LNURL', err);
    return false;
  }
}

export { parseLightningAddress };
