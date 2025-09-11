import { parseBip21Addressess } from './handleBip21Addresses.js';
import { isBitcoinAddress } from './parseBitcoinAddress.js';

function parseInput(input: string) {
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

      if (bitcoinDecoded && bitcoinDecoded.options?.lightning) {
        // parse lightning invoice here
        return {
          type: 'lightningAddress',
          data: {
            address: bitcoinDecoded.options?.lightning,
          },
        };
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
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return err.message;
    }
    return String(err);
  }
}
export { parseInput };
