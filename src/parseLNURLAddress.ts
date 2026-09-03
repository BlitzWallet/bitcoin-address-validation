import { getParams } from 'js-lnurl';
import { EMAIL_REGEX } from './constants.js';

interface WithdrawRequest {
  tag: 'withdrawRequest';
  k1: string;
  callback: string;
  domain: string;
  minWithdrawable: number;
  maxWithdrawable: number;
  defaultDescription: string;
}

// Currency descriptor advertised by an LNURL pay service.
// Covers both the LUD-22 standard shape (decimals/convertible) and the
// non-standard single-object shape used by some providers (e.g. zapremit),
// which nests its own minSendable/maxSendable and omits decimals.
interface LNURLCurrency {
  code: string;
  name: string;
  symbol: string;
  multiplier: number;
  decimals?: number;
  convertible?: {
    max: number;
    min: number;
  };
  minSendable?: number;
  maxSendable?: number;
}

// LUD-18 payerData record: the SERVICE advertises which payer-identity kinds it accepts.
// Each kind is optional; presence of the key signals acceptance. `auth` also carries a k1
// challenge. We forward this untouched so the wallet can decide what to attach (e.g. an
// `identifier` Lightning Address as a refund destination for MoneyBadger merchants).
interface PayerDataRequest {
  name?: { mandatory: boolean };
  pubkey?: { mandatory: boolean };
  identifier?: { mandatory: boolean };
  email?: { mandatory: boolean };
  auth?: { mandatory: boolean; k1: string };
  [key: string]: { mandatory: boolean; k1?: string } | undefined;
}

interface PayRequest {
  tag: 'payRequest';
  callback: string;
  domain: string;
  minSendable: number;
  maxSendable: number;
  metadata: string;
  decodedMetadata: string[][];
  commentAllowed?: number;
  payerData?: PayerDataRequest;
  currency?: LNURLCurrency;
  currencies?: LNURLCurrency[];
}

interface LoginRequest {
  tag: 'login';
  k1: string;
  callback: string;
  domain: string;
}

type LNURLParams = WithdrawRequest | PayRequest | LoginRequest;

interface ParsedLNURLData {
  type: 'withdrawRequest' | 'payRequest' | 'login';
  data: LNURLParams;
}

async function parseLNURL(address: string): Promise<ParsedLNURLData | false> {
  try {
    let params: any = {};
    if (EMAIL_REGEX.test(address)) {
      const normalizedAddress = address.replace(/^mailto:/i, '');
      const [name, domain] = normalizedAddress.split('@');
      const response = await fetch(`https://${domain}/.well-known/lnurlp/${name}`);
      const data = (await response.json()) as any;

      params = data;
    } else {
      params = (await getParams(address)) as any;
    }
    if (!('tag' in params) || typeof params.tag !== 'string') {
      console.log('LNURL params does not have a tag property:', params);
      return false;
    }

    switch (params.tag) {
      case 'withdrawRequest':
        return {
          type: 'withdrawRequest',
          data: {
            tag: params.tag,
            k1: params.k1,
            callback: params.callback,
            domain: params.domain,
            minWithdrawable: params.minWithdrawable,
            maxWithdrawable: params.maxWithdrawable,
            defaultDescription: params.defaultDescription,
          } as WithdrawRequest,
        };

      case 'payRequest':
        return {
          type: 'payRequest',
          data: {
            tag: params.tag,
            callback: params.callback,
            domain: params.domain,
            minSendable: params.minSendable,
            maxSendable: params.maxSendable,
            metadata: params.metadata,
            decodedMetadata: params.decodedMetadata,
            commentAllowed: params.commentAllowed,
            payerData: params.payerData,
            currency: params.currency,
            currencies: params.currencies,
          } as PayRequest,
        };

      case 'login':
        return {
          type: 'login',
          data: {
            tag: params.tag,
            k1: params.k1,
            callback: params.callback,
            url: params.callback,
            domain: params.domain,
          } as LoginRequest,
        };

      default:
        console.log('Unknown LNURL:', params);
        return false;
    }
  } catch (err) {
    console.log('error parsing LNURL', err);
    return false;
  }
}

// Helper functions to work with specific LNURL types
function isWithdrawRequest(data: ParsedLNURLData): data is ParsedLNURLData & { data: WithdrawRequest } {
  return data.type === 'withdrawRequest';
}

function isPayRequest(data: ParsedLNURLData): data is ParsedLNURLData & { data: PayRequest } {
  return data.type === 'payRequest';
}

function isLoginRequest(data: ParsedLNURLData): data is ParsedLNURLData & { data: LoginRequest } {
  return data.type === 'login';
}

export { parseLNURL, isWithdrawRequest, isPayRequest, isLoginRequest };

export type {
  ParsedLNURLData,
  WithdrawRequest,
  PayRequest,
  LoginRequest,
  LNURLParams,
  LNURLCurrency,
  PayerDataRequest,
};
