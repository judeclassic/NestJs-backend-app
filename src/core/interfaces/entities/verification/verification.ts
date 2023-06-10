export type VerifyPaymentUnisatResponse = {
  code: number;
  msg: 'ok' | 'error';
  data: {
    total: number;
    start: number;
    detail: {
      type: 'send' | 'inscribe-transfer' | 'receive';
      valid: boolean;
      txid: string;
      TxIdx: number;
      inscriptionNumber: number;
      inscriptionId: string;
      from: string;
      to: string;
      satoshi: number;
      amount: number;
      overallBalance: string;
      transferBalance: string;
      availableBalance: string;
      height: number;
      blocktime: number;
    }[];
  };
};

export type VerifyPaymentBlockstreamResponse = {
  txid: string;
  version: number;
  locktime: number;
  vout: [
    {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
      value: number;
    },
    {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
      value: number;
    },
  ];
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
};

export interface HiroResponseInterface {
  limit: number;
  offset: number;
  total: number;
  results: {
    block_height: number;
    block_hash: string;
    address: string;
    tx_id: string;
    location: string;
    output: string;
    value: string;
    offset: string;
    timestamp: number;
  }[];
}

export interface HiroAmountResponseInterface {
  p: string;
  op: string;
  tick: string;
  amt: number;
}
