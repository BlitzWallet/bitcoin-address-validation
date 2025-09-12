import { expect, describe, it } from 'vitest';
import { parseInput } from '../src/index';
import { InputTypes } from '../src/constants';

describe('plain bitcoin addresses', () => {
  it('validates Mainnet P2PKH', async () => {
    const address = '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem';

    const result = await parseInput(address);
    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
  });

  it('fails on invalid P2PKH', async () => {
    const address = '17VZNX1SN5NtKa8UFFxwQbFeFc3iqRYhem';

    const result = await parseInput(address);
    expect(result && 'type' in result ? result.type : undefined).toEqual(undefined);
  });

  it('validates Mainnet P2SH', async () => {
    const address = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy';

    const result = await parseInput(address);
    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
  });

  it('fails on invalid P2SH', async () => {
    const address = '17VZNX1SN5NtKa8UFFxwQbFFFc3iqRYhem';

    const result = await parseInput(address);
    expect(result && 'type' in result ? result.type : undefined).toEqual(undefined);
  });

  it('handles bogus address', async () => {
    const address = 'x';

    const result = await parseInput(address);
    expect(result && 'type' in result ? result.type : undefined).toEqual(undefined);
  });

  it('validates Mainnet Bech32 P2WPKH', async () => {
    const addresses = ['bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', 'bc1q973xrrgje6etkkn9q9azzsgpxeddats8ckvp5s'];

    const result1 = await parseInput(addresses[0]);
    const result2 = await parseInput(addresses[1]);

    expect(result1 && 'type' in result1 ? result1.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result2 && 'type' in result2 ? result2.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
  });

  it('validates uppercase Bech32 P2WPKH', async () => {
    const addresses = ['BC1Q973XRRGJE6ETKKN9Q9AZZSGPXEDDATS8CKVP5S', 'BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4'];

    const result1 = await parseInput(addresses[0]);
    const result2 = await parseInput(addresses[1]);

    expect(result1 && 'type' in result1 ? result1.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result2 && 'type' in result2 ? result2.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
  });

  it('validates Mainnet Bech32 P2TR', async () => {
    const address = 'bc1ptxs597p3fnpd8gwut5p467ulsydae3rp9z75hd99w8k3ljr9g9rqx6ynaw';

    const result = await parseInput(address);
    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
  });

  it('validates Mainnet Bech32 P2WSH', async () => {
    const address = 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3';

    const result = await parseInput(address);
    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
  });

  it('fails on invalid Bech32', async () => {
    const address = 'bc1qw508d6qejxtdg4y5r3zrrvary0c5xw7kv8f3t4';

    const result = await parseInput(address);
    expect(result && 'type' in result ? result.type : undefined).toEqual(undefined);
  });

  it('errors on non-base58 encoded', async () => {
    const result = await parseInput('???');
    expect(result && 'type' in result ? result.type : undefined).toEqual(undefined);
  });
});

describe('bip21 bitcoin addresses', async () => {
  it('none', async () => {
    const address = '1andreas3batLhQa2FawWjeyjCqyBzypd';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
    });
  });

  it('capitalized bitcoin', async () => {
    const address = 'BITCOIN:1andreas3batLhQa2FawWjeyjCqyBzypd';

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
    });
  });

  it('lowercase bitcoin', async () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd';

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
    });
  });

  it('bitcoin with amount', async () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd?amount=0.00002000';

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      amount: '0.00002000',
    });
  });
  it('bitcoin with label', async () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd?amount=0.00002000&label=Hello';

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      amount: '0.00002000',
      label: 'Hello',
    });
  });

  it('bitcoin with label and message', async () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd?amount=0.00002000&label=Hello&message=Msg';

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      amount: '0.00002000',
      label: 'Hello',
      message: 'Msg',
    });
  });

  it('bitcoin with label and message upper', async () => {
    const address = 'BITCOIN:1andreas3batLhQa2FawWjeyjCqyBzypd?amount=0.00002000&label=Hello&message=Msg';

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      amount: '0.00002000',
      label: 'Hello',
      message: 'Msg',
    });
  });

  it('bitcoin with lightning LNURL', async () => {
    const address =
      'bitcoin:bc1qhr8mncfw3q7lr8f0fxj08lggm5l8s80ahzm5tl?amount=0.00000021&lightning=lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('coinos.io');
      }
      if ('minSendable' in result.data) {
        expect(result.data.minSendable).toEqual(1000);
      }
      if ('maxSendable' in result.data) {
        expect(result.data.maxSendable).toEqual(1000000000000);
      }
      if ('commentAllowed' in result.data) {
        expect(result.data.commentAllowed).toEqual(512);
      }

      if ('callback' in result.data) {
        expect(result.data.callback).toBeDefined();
      }
    }
  });

  it('bitcoin with lightning bolt11', async () => {
    const address =
      'bitcoin:bc1qhr8mncfw3q7lr8f0fxj08lggm5l8s80ahzm5tl?amount=0.00000021&lightning=lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BOLT11);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address:
        'lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz',
      expire_time: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
    });
  });
});

describe('bolt11 invoices', () => {
  it('none', async () => {
    const address =
      'lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BOLT11);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address:
        'lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz',
      expire_time: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
    });
  });
});

describe('lightning link invoices', () => {
  it('bolt11', async () => {
    const address =
      'lightning:lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BOLT11);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address:
        'lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz',
      expire_time: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
    });
  });

  it('lnurl', async () => {
    const address = 'lightning:lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('coinos.io');
      }
      if ('minSendable' in result.data) {
        expect(result.data.minSendable).toEqual(1000);
      }
      if ('maxSendable' in result.data) {
        expect(result.data.maxSendable).toEqual(1000000000000);
      }
      if ('commentAllowed' in result.data) {
        expect(result.data.commentAllowed).toEqual(512);
      }

      if ('callback' in result.data) {
        expect(result.data.callback).toBeDefined();
      }
    }
  });
});

describe('LNURL invoices', () => {
  it('pay', async () => {
    const address = 'lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('coinos.io');
      }
      if ('minSendable' in result.data) {
        expect(result.data.minSendable).toEqual(1000);
      }
      if ('maxSendable' in result.data) {
        expect(result.data.maxSendable).toEqual(1000000000000);
      }
      if ('commentAllowed' in result.data) {
        expect(result.data.commentAllowed).toEqual(512);
      }

      if ('callback' in result.data) {
        expect(result.data.callback).toBeDefined();
      }
    }
  });

  it(InputTypes.LNURL_AUTH, async () => {
    const address =
      'LNURL1DP68GURN8GHJ7MRFVA58GMNFDENKCMM8D9HZUMRFWEJJ7MR0VA5KU0MTXY7NVCMY8PJNJC33VD3XXWFEV9NRWCTZXVMNVD33X4SKZDFJXE3NYVNP893NGCFJXAJXVDESVCUNVDE48QMRJEPKXVENXENPV43KYWP3VSN8GCT884KX7EMFDCDFKVAC';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_AUTH);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual(
        'LNURL1DP68GURN8GHJ7MRFVA58GMNFDENKCMM8D9HZUMRFWEJJ7MR0VA5KU0MTXY7NVCMY8PJNJC33VD3XXWFEV9NRWCTZXVMNVD33X4SKZDFJXE3NYVNP893NGCFJXAJXVDESVCUNVDE48QMRJEPKXVENXENPV43KYWP3VSN8GCT884KX7EMFDCDFKVAC',
      );
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_AUTH);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('lightninglogin.live');
      }
    }
  });

  it('lnurl pay email form ', async () => {
    const address = 'blake@blitz-wallet.com';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('blake@blitz-wallet.com');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
    }
  });

  it('lnurl pay url form ', async () => {
    const address = 'https://blitz-wallet.com/.well-known/lnurlp/blake';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('https://blitz-wallet.com/.well-known/lnurlp/blake');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
    }
  });

  it('lnurl auth in webquery ', async () => {
    const address =
      'https://blitz-wallet.com?lightning=LNURL1DP68GURN8GHJ7MRFVA58GMNFDENKCMM8D9HZUMRFWEJJ7MR0VA5KU0MTXY7NVCMY8PJNJC33VD3XXWFEV9NRWCTZXVMNVD33X4SKZDFJXE3NYVNP893NGCFJXAJXVDESVCUNVDE48QMRJEPKXVENXENPV43KYWP3VSN8GCT884KX7EMFDCDFKVAC';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_AUTH);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_AUTH);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual(
        'LNURL1DP68GURN8GHJ7MRFVA58GMNFDENKCMM8D9HZUMRFWEJJ7MR0VA5KU0MTXY7NVCMY8PJNJC33VD3XXWFEV9NRWCTZXVMNVD33X4SKZDFJXE3NYVNP893NGCFJXAJXVDESVCUNVDE48QMRJEPKXVENXENPV43KYWP3VSN8GCT884KX7EMFDCDFKVAC',
      );
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_AUTH);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('lightninglogin.live');
      }
    }
  });
});
