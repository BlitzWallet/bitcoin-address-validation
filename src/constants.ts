const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const WEBSITE_REGEX = /^(https?:\/\/|www\.)[a-z\d]([a-z\d-]*[a-z\d])*(\.[a-z]{2,})+/i;

const InputTypes = {
  BITCOIN_ADDRESS: 'bitcoinAddress',
  BOLT11: 'bolt11Address',
  LNURL_PAY: 'payRequest',
  LNURL_AUTH: 'login',
  LNURL_WITHDRAWL: 'withdrawRequest',
};

export { EMAIL_REGEX, InputTypes, WEBSITE_REGEX };
