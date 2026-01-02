import { expect, describe, it, vi, afterEach } from 'vitest';
import { parseInput } from '../src/index';
import { InputTypes } from '../src/constants';
import { bech32 } from 'bech32';

let mockGetLnurlParams = {};

vi.mock('js-lnurl', () => ({
  getParams: () => mockGetLnurlParams,
  findlnurl: () => null,
}));

function encodeLnurl(url: string): string {
  const words = bech32.toWords(Buffer.from(url, 'utf8'));
  return bech32.encode('lnurl', words, 1023);
}

describe('bitcoin addresses', () => {
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
      bech32: false,
      network: 'mainnet',
      type: 'p2pkh',
    });
  });

  it('capitalized bitcoin', async () => {
    const address = 'BITCOIN:1andreas3batLhQa2FawWjeyjCqyBzypd';

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      bech32: false,
      network: 'mainnet',
      type: 'p2pkh',
    });
  });

  it('lowercase bitcoin', async () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd';

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      bech32: false,
      network: 'mainnet',
      type: 'p2pkh',
    });
  });

  it('bitcoin with amount', async () => {
    const address = 'bitcoin:1andreas3batLhQa2FawWjeyjCqyBzypd?amount=0.00002000';

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BITCOIN_ADDRESS);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address: '1andreas3batLhQa2FawWjeyjCqyBzypd',
      amount: '0.00002000',
      bech32: false,
      network: 'mainnet',
      type: 'p2pkh',
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
      bech32: false,
      network: 'mainnet',
      type: 'p2pkh',
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
      bech32: false,
      network: 'mainnet',
      type: 'p2pkh',
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
      bech32: false,
      network: 'mainnet',
      type: 'p2pkh',
    });
  });

  it('bitcoin with lightning LNURL', async () => {
    const address =
      'bitcoin:bc1qhr8mncfw3q7lr8f0fxj08lggm5l8s80ahzm5tl?amount=0.00000021&lightning=lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk';

    mockGetLnurlParams = {
      tag: 'payRequest',
      callback: 'https://blitzwalletapp/lnurl/cb',
      minSendable: 1000,
      maxSendable: 1000000000000,
      metadata: '[["text/plain","Donation"],["text/identifier","user@blitzwalletapp"]]',
      commentAllowed: 512,
      domain: 'blitzwalletapp',
    };

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('blitzwalletapp');
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
      expiry: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
      amountMsat: 11000,
      timestamp: 1651524875,
    });
  });
});

describe('bolt11 invoices', () => {
  it('bolt11 lower', async () => {
    const address =
      'lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BOLT11);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address:
        'lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz',
      expiry: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
      amountMsat: 11000,
      timestamp: 1651524875,
    });
  });
  it('bolt11 no sats property', async () => {
    const address =
      'lnbc26887810p1p55txnvpp5rjh55up4367dx24v0ksm0w0v023nwz37rfxuzdmhvx923007dflqcqzyssp5z9yf7z78la7vunh4x4gxfwta0vehf99xgk35ykken0xx8k5nq78q9q7sqqqqqqqqqqqqqqqqqqqsqqqqqysgqdq87z06hggmqz9gxqyjw5qrzjqwryaup9lh50kkranzgcdnn2fgvx390wgj5jd07rwr3vxeje0glcllmqrcrlqsaqncqqqqlgqqqqqeqqjqvekmjf0ds87ugs5k2xavg0klhqu72xpnzg2t6fnn5uz78n3rjclr0439gkmhja56qwm3vznjrdqjn8s4988vcr8s07mt2j2zd39kmcsq9xrgz5';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BOLT11);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address:
        'lnbc26887810p1p55txnvpp5rjh55up4367dx24v0ksm0w0v023nwz37rfxuzdmhvx923007dflqcqzyssp5z9yf7z78la7vunh4x4gxfwta0vehf99xgk35ykken0xx8k5nq78q9q7sqqqqqqqqqqqqqqqqqqqsqqqqqysgqdq87z06hggmqz9gxqyjw5qrzjqwryaup9lh50kkranzgcdnn2fgvx390wgj5jd07rwr3vxeje0glcllmqrcrlqsaqncqqqqlgqqqqqeqqjqvekmjf0ds87ugs5k2xavg0klhqu72xpnzg2t6fnn5uz78n3rjclr0439gkmhja56qwm3vznjrdqjn8s4988vcr8s07mt2j2zd39kmcsq9xrgz5',
      expiry: 604800,
      description: '🫡',
      payment_hash: '1caf4a70358ebcd32aac7da1b7b9ec7aa3370a3e1a4dc13777618aa8bdfe6a7e',
      amountSat: 2689,
      amountMsat: 2688781,
      timestamp: 1766169196,
    });
  });
  it('bolt11 upper', async () => {
    const address =
      'LNBC110N1P38Q3GTPP5YPZ09JRD8P993SNJWNM68CPH4FTWP22LE34XD4R8FTSPWSHXHMNSDQQXQYJW5QCQPXSP5HTLG8YDPYWVSA7H3U4HDN77EHS4Z4E844EM0APJYVMQFKZQHHD2Q9QGSQQQYSSQSZPXZXT9UUQZYMR7ZXCDCCJ5G69S8Q7ZZJS7SGXN9EJHNVDH6GQJCY22MSS2YEXUNAGM5R2GQCZH8K24CWRQML3NJSKM548ARUHPWSSQ9NVRVZ';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BOLT11);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address:
        'LNBC110N1P38Q3GTPP5YPZ09JRD8P993SNJWNM68CPH4FTWP22LE34XD4R8FTSPWSHXHMNSDQQXQYJW5QCQPXSP5HTLG8YDPYWVSA7H3U4HDN77EHS4Z4E844EM0APJYVMQFKZQHHD2Q9QGSQQQYSSQSZPXZXT9UUQZYMR7ZXCDCCJ5G69S8Q7ZZJS7SGXN9EJHNVDH6GQJCY22MSS2YEXUNAGM5R2GQCZH8K24CWRQML3NJSKM548ARUHPWSSQ9NVRVZ',
      expiry: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
      amountMsat: 11000,
      timestamp: 1651524875,
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
      expiry: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
      amountMsat: 11000,
      timestamp: 1651524875,
    });
  });
  it('bolt11 upper with lightning', async () => {
    const address =
      'lightning:LNBC110N1P38Q3GTPP5YPZ09JRD8P993SNJWNM68CPH4FTWP22LE34XD4R8FTSPWSHXHMNSDQQXQYJW5QCQPXSP5HTLG8YDPYWVSA7H3U4HDN77EHS4Z4E844EM0APJYVMQFKZQHHD2Q9QGSQQQYSSQSZPXZXT9UUQZYMR7ZXCDCCJ5G69S8Q7ZZJS7SGXN9EJHNVDH6GQJCY22MSS2YEXUNAGM5R2GQCZH8K24CWRQML3NJSKM548ARUHPWSSQ9NVRVZ';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BOLT11);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address:
        'LNBC110N1P38Q3GTPP5YPZ09JRD8P993SNJWNM68CPH4FTWP22LE34XD4R8FTSPWSHXHMNSDQQXQYJW5QCQPXSP5HTLG8YDPYWVSA7H3U4HDN77EHS4Z4E844EM0APJYVMQFKZQHHD2Q9QGSQQQYSSQSZPXZXT9UUQZYMR7ZXCDCCJ5G69S8Q7ZZJS7SGXN9EJHNVDH6GQJCY22MSS2YEXUNAGM5R2GQCZH8K24CWRQML3NJSKM548ARUHPWSSQ9NVRVZ',
      expiry: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
      amountMsat: 11000,
      timestamp: 1651524875,
    });
  });
  it('bolt11 lower with lightning upper', async () => {
    const address =
      'LIGHTNING:lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BOLT11);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address:
        'lnbc110n1p38q3gtpp5ypz09jrd8p993snjwnm68cph4ftwp22le34xd4r8ftspwshxhmnsdqqxqyjw5qcqpxsp5htlg8ydpywvsa7h3u4hdn77ehs4z4e844em0apjyvmqfkzqhhd2q9qgsqqqyssqszpxzxt9uuqzymr7zxcdccj5g69s8q7zzjs7sgxn9ejhnvdh6gqjcy22mss2yexunagm5r2gqczh8k24cwrqml3njskm548aruhpwssq9nvrvz',
      expiry: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
      amountMsat: 11000,
      timestamp: 1651524875,
    });
  });
  it('bolt11 upper with lightning upper', async () => {
    const address =
      'LIGHTNING:LNBC110N1P38Q3GTPP5YPZ09JRD8P993SNJWNM68CPH4FTWP22LE34XD4R8FTSPWSHXHMNSDQQXQYJW5QCQPXSP5HTLG8YDPYWVSA7H3U4HDN77EHS4Z4E844EM0APJYVMQFKZQHHD2Q9QGSQQQYSSQSZPXZXT9UUQZYMR7ZXCDCCJ5G69S8Q7ZZJS7SGXN9EJHNVDH6GQJCY22MSS2YEXUNAGM5R2GQCZH8K24CWRQML3NJSKM548ARUHPWSSQ9NVRVZ';
    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.BOLT11);
    expect(result && 'data' in result ? result.data : undefined).toEqual({
      address:
        'LNBC110N1P38Q3GTPP5YPZ09JRD8P993SNJWNM68CPH4FTWP22LE34XD4R8FTSPWSHXHMNSDQQXQYJW5QCQPXSP5HTLG8YDPYWVSA7H3U4HDN77EHS4Z4E844EM0APJYVMQFKZQHHD2Q9QGSQQQYSSQSZPXZXT9UUQZYMR7ZXCDCCJ5G69S8Q7ZZJS7SGXN9EJHNVDH6GQJCY22MSS2YEXUNAGM5R2GQCZH8K24CWRQML3NJSKM548ARUHPWSSQ9NVRVZ',
      expiry: 604800,
      description: '',
      payment_hash: '2044f2c86d384a58c27274f7a3e037aa56e0a95fcc6a66d4674ae01742e6bee7',
      amountSat: 11,
      amountMsat: 11000,
      timestamp: 1651524875,
    });
  });

  it('lnurl', async () => {
    const address = 'lightning:lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk';

    mockGetLnurlParams = {
      tag: 'payRequest',
      callback: 'https://blitzwalletapp/lnurl/cb',
      minSendable: 1000,
      maxSendable: 1000000000000,
      metadata: '[["text/plain","LNURL Lightning Link"]]',
      commentAllowed: 512,
      domain: 'blitzwalletapp',
    };

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('blitzwalletapp');
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
  it('lnurl upper', async () => {
    const address = 'lightning:LNURL1DP68GURN8GHJ7CM0D9HX7UEWD9HJ7UP0VFHKYSUZMTK';

    mockGetLnurlParams = {
      tag: 'payRequest',
      callback: 'https://blitzwalletapp/lnurl/cb',
      minSendable: 1000,
      maxSendable: 1000000000000,
      metadata: '[["text/plain","LNURL Lightning Link"]]',
      commentAllowed: 512,
      domain: 'blitzwalletapp',
    };

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('LNURL1DP68GURN8GHJ7CM0D9HX7UEWD9HJ7UP0VFHKYSUZMTK');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('blitzwalletapp');
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
  it('lnurl upper lightning upper', async () => {
    const address = 'LIGHTNING:LNURL1DP68GURN8GHJ7CM0D9HX7UEWD9HJ7UP0VFHKYSUZMTK';

    mockGetLnurlParams = {
      tag: 'payRequest',
      callback: 'https://blitzwalletapp/lnurl/cb',
      minSendable: 1000,
      maxSendable: 1000000000000,
      metadata: '[["text/plain","LNURL Lightning Link"]]',
      commentAllowed: 512,
      domain: 'blitzwalletapp',
    };

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('LNURL1DP68GURN8GHJ7CM0D9HX7UEWD9HJ7UP0VFHKYSUZMTK');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('blitzwalletapp');
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
  it('lnurl lower lightning upper', async () => {
    const address = 'LIGHTNING:lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk';

    mockGetLnurlParams = {
      tag: 'payRequest',
      callback: 'https://blitzwalletapp/lnurl/cb',
      minSendable: 1000,
      maxSendable: 1000000000000,
      metadata: '[["text/plain","LNURL Lightning Link"]]',
      commentAllowed: 512,
      domain: 'blitzwalletapp',
    };

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('blitzwalletapp');
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

    mockGetLnurlParams = {
      tag: 'payRequest',
      callback: 'https://blitzwalletapp/lnurl/cb',
      minSendable: 1000,
      maxSendable: 1000000000000,
      metadata: '[["text/plain","Test Pay"]] ',
      commentAllowed: 512,
      domain: 'blitzwalletapp',
    };

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('lnurl1dp68gurn8ghj7cm0d9hx7uewd9hj7up0vfhkysuzmtk');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('blitzwalletapp');
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
    mockGetLnurlParams = {
      tag: 'login',
      k1: 'abcdef1234567890',
      callback: 'https://blitzwalletapp/lnurl/auth',
      domain: 'blitzwalletapp',
    };

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
        expect(result.data.domain).toEqual('blitzwalletapp');
      }
    }
  });

  it('lnurl pay email form ', async () => {
    const address = 'blake@blitz-wallet.com';
    mockGetLnurlParams = {
      tag: 'payRequest',
      callback: 'https://blitzwalletapp.com/lnurlp/blake',
      minSendable: 1000,
      maxSendable: 21000,
      metadata: '[["text/plain","Email pay test"]]',
    };

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

    mockGetLnurlParams = {
      tag: 'payRequest',
      callback: 'https://blitz-wallet.com/lnurl/cb',
      minSendable: 1000,
      maxSendable: 21000,
      metadata: '[["text/plain","Web URL pay test"]]',
    };

    const result = await parseInput(address);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_PAY);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual('https://blitz-wallet.com/.well-known/lnurlp/blake');
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_PAY);
      }
    }
  });

  it('parses lnurl-withdraw response', async () => {
    // Example LNURL-withdraw (bech32 string, can be any valid encoded URL)
    const lnurlWithdraw = encodeLnurl('https://blitzwalletapp/lnurl/withdraw?id=123');

    // Mock LNURL-withdraw JSON as per spec
    mockGetLnurlParams = {
      tag: 'withdrawRequest',
      k1: '0123456789abcdef0123456789abcdef',
      callback: 'https://blitzwalletapp/lnurl/withdraw',
      defaultDescription: 'Withdraw test funds',
      minWithdrawable: 1000,
      maxWithdrawable: 200000,
      domain: 'blitzwalletapp',
    };

    const result = await parseInput(lnurlWithdraw);

    expect(result && 'type' in result ? result.type : undefined).toEqual(InputTypes.LNURL_WITHDRAWL);

    if (result && 'data' in result) {
      expect(result.data.address).toEqual(lnurlWithdraw);
      if ('tag' in result.data) {
        expect(result.data.tag).toEqual(InputTypes.LNURL_WITHDRAWL);
      }
      if ('domain' in result.data) {
        expect(result.data.domain).toEqual('blitzwalletapp');
      }
      if ('k1' in result.data) {
        expect(result.data.k1).toEqual('0123456789abcdef0123456789abcdef');
      }
      if ('callback' in result.data) {
        expect(result.data.callback).toEqual('https://blitzwalletapp/lnurl/withdraw');
      }
    }
  });

  it('lnurl auth in webquery ', async () => {
    const address =
      'https://blitz-wallet.com?lightning=LNURL1DP68GURN8GHJ7MRFVA58GMNFDENKCMM8D9HZUMRFWEJJ7MR0VA5KU0MTXY7NVCMY8PJNJC33VD3XXWFEV9NRWCTZXVMNVD33X4SKZDFJXE3NYVNP893NGCFJXAJXVDESVCUNVDE48QMRJEPKXVENXENPV43KYWP3VSN8GCT884KX7EMFDCDFKVAC';

    mockGetLnurlParams = {
      tag: 'login',
      k1: 'deadbeefdeadbeef',
      callback: 'https://blitzwalletapp/lnurl/auth',
      domain: 'blitzwalletapp',
    };

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
        expect(result.data.domain).toEqual('blitzwalletapp');
      }
    }
  });
});

describe('LNURL LUDs tests (fake / mocked)', () => {
  it('LNURL Pay (LUD-06) – parses payRequest correctly', async () => {
    const fakeLnurlUrl = encodeLnurl('https://pay.example.com/lnurl/pay?id=abc123');
    mockGetLnurlParams = {
      tag: 'payRequest',
      callback: 'https://pay.example.com/lnurl/pay/callback?id=abc123',
      domain: 'pay.example.com',
      minSendable: 1000, // millisatoshis
      maxSendable: 5000000, // millisatoshis
      metadata: '[["text/plain","Donate to me"],["text/identifier","donor@example.com"]]',
      commentAllowed: 200,
      // Optionally decodedMetadata etc if your code handles them
    };

    const result = await parseInput(fakeLnurlUrl);
    if (!result) throw new Error('No parse');

    expect(result.type).toEqual('payRequest');
    if ('tag' in result.data) {
      expect(result.data.tag).toEqual('payRequest');
    }
    if ('domain' in result.data) {
      expect(result.data.domain).toEqual('pay.example.com');
    }
  });

  it('LNURL Withdraw (LUD-03) – parses withdrawRequest correctly', async () => {
    const fakeLnurlUrl = encodeLnurl('https://withdraw.example.com/lnurl/withdraw?id=xyz789');
    mockGetLnurlParams = {
      tag: 'withdrawRequest',
      callback: 'https://withdraw.example.com/lnurl/withdraw/callback?id=xyz789',
      domain: 'withdraw.example.com',
      k1: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      defaultDescription: 'Withdraw your funds',
      minWithdrawable: 500, // millli­satoshis
      maxWithdrawable: 2000000, // millisatoshis
    };

    const result = await parseInput(fakeLnurlUrl);
    if (!result) throw new Error('No parse');

    if ('type' in result.data) {
      expect(result.type).toEqual('withdrawRequest');
    }
    if ('tag' in result.data) {
      expect(result.data.tag).toEqual('withdrawRequest');
    }
  });

  it('LNURL Auth (LUD-04) – parses login correctly', async () => {
    const fakeLnurlUrl = encodeLnurl('https://auth.example.com/lnurl/auth?id=auth123');
    mockGetLnurlParams = {
      tag: 'login',
      k1: 'cafebabecafebabecafebabecafebabecafebabecafebabecafebabecafebabe',
      callback: 'https://auth.example.com/lnurl/auth/callback?id=auth123',
      domain: 'auth.example.com',
    };

    const result = await parseInput(fakeLnurlUrl);
    if (!result) throw new Error('No parse');

    expect(result.type).toEqual('login');

    if ('tag' in result.data) {
      expect(result.data.tag).toEqual('login');
    }
    if ('domain' in result.data) {
      expect(result.data.domain).toEqual('auth.example.com');
    }
  });
});
