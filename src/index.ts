import { parseBip21Addressess } from './handleBip21Addresses.js';
import { isBitcoinAddress } from './parseBitcoinAddress.js';
import { parseLightningAddress } from './parseLightningAddress.js';

async function parseInput(input: string) {
  try {
    // is plain Bitcoin address
    if (isBitcoinAddress(input)) {
      return {
        type: 'bitcoinAddress',
        data: {
          address: input,
        },
      };
    }

    // bitcoin only bip21 address
    if (input.toLowerCase().startsWith('bitcoin')) {
      const bitcoinDecoded = parseBip21Addressess(input, 'bitcoin');

      // check if address includes lightning and default to lightning
      if (bitcoinDecoded && bitcoinDecoded.options?.lightning) {
        // parse lightning invoice here
        const lightningParse = parseLightningAddress(bitcoinDecoded.options?.lightning);

        if (lightningParse) {
          return lightningParse;
        } else throw new Error('Invalid lightning argument');
      }

      const data = bitcoinDecoded && bitcoinDecoded.options ? bitcoinDecoded.options : {};
      const address = bitcoinDecoded && bitcoinDecoded.address ? bitcoinDecoded.address : '';
      if (isBitcoinAddress(address)) {
        return {
          type: 'bitcoinAddress',
          data: {
            address,
            ...data,
            amount: data.amount?.toFixed(8),
          },
        };
      } else {
        throw new Error('You have not passed a Valid bitcoin address');
      }
    }

    //lightning link codes
    if (input.toLowerCase().startsWith('lightning')) {
      const lightningDecoded = parseBip21Addressess(input, 'lightning');
      if (lightningDecoded && lightningDecoded.address) {
        const lightningParse = await parseLightningAddress(lightningDecoded.address);
        if (lightningParse) {
          return lightningParse;
        } else throw new Error('Invalid lightning argument');
      } else throw new Error('Invalid lightning argument');
    }

    // bolt11 resposne
    if (input.toLowerCase().startsWith('lnbc')) {
      const lightningParse = await parseLightningAddress(input);
      console.log(lightningParse);
      if (lightningParse) {
        return lightningParse;
      } else throw new Error('Invalid lightning argument');
    }

    if (input.toLowerCase().startsWith('lnurl')) {
      const lightningParse = await parseLightningAddress(input);
      console.log(lightningParse);
      if (lightningParse) {
        return lightningParse;
      } else throw new Error('Invalid lightning argument');
    }
  } catch (err) {
    console.log(err);
    throw new Error(typeof err === 'string' ? err : err instanceof Error ? err.message : JSON.stringify(err));
  }
}
export { parseInput };
