export enum TransactionEventEnum {
  transaction_success = 'transaction.success',
  transaction_failed = 'transaction.failed',
  transaction_updated = 'transaction_updated',
}

export enum UserEventEnum {
  userconnectwallet = 'user.connect.wallet',
  user_fund_wallet = 'user.fund.wallet',
  user_request_payout = 'user.request.payout',
  user_cancel_payout = 'user.cancel.payout',
}
