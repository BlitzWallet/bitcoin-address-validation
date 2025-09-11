import { expect, describe, it } from 'vitest';
import { getAddressInfo } from '../src/parseBitcoinAddress';
import { parseInput } from '../src/index';
describe('Validation and parsing', () => {
  it('validates Mainnet P2PKH', () => {
    const address = '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem';

    expect(parseInput(address)?.type).toEqual('bitcoinAddress');
  });

  it('fails on invalid P2PKH', () => {
    const address = '17VZNX1SN5NtKa8UFFxwQbFeFc3iqRYhem';

    expect(parseInput(address)?.type).toEqual(undefined);
  });

  it('validates Mainnet P2SH', () => {
    const address = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy';

    expect(parseInput(address)?.type).toEqual('bitcoinAddress');
  });

  it('fails on invalid P2SH', () => {
    const address = '17VZNX1SN5NtKa8UFFxwQbFFFc3iqRYhem';

    expect(parseInput(address)?.type).toEqual(undefined);
  });

  it('handles bogus address', () => {
    const address = 'x';

    expect(parseInput(address)?.type).toEqual(undefined);
  });

  it('validates Mainnet Bech32 P2WPKH', () => {
    const addresses = ['bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', 'bc1q973xrrgje6etkkn9q9azzsgpxeddats8ckvp5s'];

    expect(parseInput(addresses[0])?.type).toEqual('bitcoinAddress');
    expect(parseInput(addresses[1])?.type).toEqual('bitcoinAddress');
  });

  it('validates uppercase Bech32 P2WPKH', () => {
    const addresses = ['BC1Q973XRRGJE6ETKKN9Q9AZZSGPXEDDATS8CKVP5S', 'BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4'];

    expect(parseInput(addresses[0])?.type).toEqual('bitcoinAddress');
    expect(parseInput(addresses[1])?.type).toEqual('bitcoinAddress');
  });

  it('validates Mainnet Bech32 P2TR', () => {
    const address = 'bc1ptxs597p3fnpd8gwut5p467ulsydae3rp9z75hd99w8k3ljr9g9rqx6ynaw';

    expect(parseInput(address)?.type).toEqual('bitcoinAddress');
  });

  it('validates Mainnet Bech32 P2WSH', () => {
    const address = 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3';

    expect(parseInput(address)?.type).toEqual('bitcoinAddress');
  });

  it('fails on invalid Bech32', () => {
    const address = 'bc1qw508d6qejxtdg4y5r3zrrvary0c5xw7kv8f3t4';

    expect(parseInput(address)?.type).toEqual(undefined);
  });

  it('errors on non-base58 encoded', () => {
    expect(parseInput('???')?.type).toEqual(undefined);
  });
});
