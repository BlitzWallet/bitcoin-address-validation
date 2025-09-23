# Bitcoin Address Parser

A universal address parser for Bitcoin and Lightning wallets.  
This package makes it easy to handle **any type of Bitcoin-related address** in your app, including:

- **BOLT11 invoices**
- **LNURLs**
- **On-chain Bitcoin addresses**
- **Bitcoin URIs** (`bitcoin:<address>?amount=...`)

Perfect for wallets, point-of-sale apps, or any Bitcoin/Lightning integration where users might paste or scan an address in different formats.

---

## Features

- Detects and normalizes any Bitcoin or Lightning address.
- Returns structured data (type, amount, metadata, etc.).
- Works in **Node.js** and **modern browsers**.

---

## Installation

```bash
npm install bitcoin-address-parser
```

or

```bash
yarn add bitcoin-address-parser
```

---

## Usage

```js
import { parseAddress } from 'bitcoin-address-parser';

// Example 1: On-chain Bitcoin address
const result1 = parseAddress('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080');
console.log(result1);
/*
{
  type: "bitcoinAddress",
  data: {
    address,
  }
}
*/

// Example 2: BOLT11 invoice
const result2 = parseAddress('lnbc2500u1p0...');
console.log(result2);
/*
{
  type: "bolt11Address",
  data:{
    amountSat,
    amountMsat,
    expiry,
    payment_hash,
    description,
    timestamp,
  }
}
*/

// Example 3: LNURL
const result3 = parseAddress('lnurl1dp68gurn8...');
console.log(result3);
/*
{
  type: "withdrawRequest | payRequest | login",
  data:{
  Lnurl specific data
  }
}
*/

// Example 4: Bitcoin URI
const result4 = parseAddress('bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.001');
console.log(result4);
/*
{
  type: "bitcoinAddress",
  data:{
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    bip21 options
  }
}
*/
```

---

## Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open a PR or submit an issue on [GitHub](https://github.com/BlitzWallet/bitcoin-address-validation/issues).

---

## License

Apache 2.0 © Blitz Wallet
