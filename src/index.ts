import validate from './parseBitcoinAddress.js';

function parseInput(input: string) {
  try {
    if (validate(input)) {
      return {
        type: 'bitcoinAddress',
        data: {
          address: input,
        },
      };
    }
  } catch (err) {
    console.log(err);
  }
}
export { parseInput };
