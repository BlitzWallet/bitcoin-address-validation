import { expect, describe, it } from 'vitest';
import { parseInput } from '../src/index';

describe('plain bitcoin addresses', () => {
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

describe('bip21 bitcoin addresses', () => {
  it('none', () => {
    const address = '1andreas3batLhQa2FawWjeyjCqyBzypd';
    const result = parseInput(address);
    expect(result?.type).toEqual('bitcoinAddress');
    expect(result?.data).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
    });
  });

  it('capitalized bitcoin', () => {
    const address = 'BITCOIN:1andreas3batLhQa2FawWjeyjCqyBzypd';
    const result = parseInput(address);
    expect(result?.type).toEqual('bitcoinAddress');
    expect(result?.data).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
    });
  });

  it('lowercase bitcoin', () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd';

    const result = parseInput(address);
    expect(result?.type).toEqual('bitcoinAddress');
    expect(result?.data).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
    });
  });

  it('bitcoin with amount', () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd?amount=0.00002000';
    const result = parseInput(address);
    expect(result?.type).toEqual('bitcoinAddress');
    expect(result?.data).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      amount: '0.00002000',
    });
  });
  it('bitcoin with label', () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd?amount=0.00002000&label=Hello';
    const result = parseInput(address);
    expect(result?.type).toEqual('bitcoinAddress');
    expect(result?.data).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      amount: '0.00002000',
      label: 'Hello',
    });
  });

  it('bitcoin with label and message', () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd?amount=0.00002000&label=Hello&message=Msg';
    const result = parseInput(address);
    expect(result?.type).toEqual('bitcoinAddress');
    expect(result?.data).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      amount: '0.00002000',
      label: 'Hello',
      message: 'Msg',
    });
  });

  it('bitcoin with label and message upper', () => {
    const address = 'BITCOIN:1andreas3batLhQa2FawWjeyjCqyBzypd?amount=0.00002000&label=Hello&message=Msg';
    const result = parseInput(address);
    expect(result?.type).toEqual('bitcoinAddress');
    expect(result?.data).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      amount: '0.00002000',
      label: 'Hello',
      message: 'Msg',
    });
  });

  it('bitcoin with lightning', () => {
    const address =
      'bitcoin:bc1qhr8mncfw3q7lr8f0fxj08lggm5l8s80ahzm5tl?amount=0.00000021&lightning=lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk';
    const result = parseInput(address);
    expect(result?.type).toEqual('lightningAddress');
    expect(result?.data).toEqual({
      address: 'lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk',
    });
  });
});
