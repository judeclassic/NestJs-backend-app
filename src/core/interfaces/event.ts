export enum TransactionEventEnum {
  transaction_updated = 'transaction_updated', //send to other services (swap & liquidity)
  modify_user_wallet = 'modify_user_wallet', //use when user either deposit, withdraw, liquidity, swap (send to user only)
  payout_handle_by_admin = 'payout_handle_by_admin',
}

export enum UserEventEnum {
  user_connected_wallet = 'user_connected_wallet',
  user_request_payout = 'user_request_payout',
  user_cancel_payout = 'user_cancel_payout',
  user_deposited = 'user_deposited',
  update_user = 'update_user',
}

export enum SwapEventEnum {
  user_swap_token = 'user_swap_token',
}

export enum LiquidityEventEnum {
  user_added_liquidity = 'user_added_liquidity',
  user_remove_liquidity = 'user_remove_liquidity',
  admin_added_coin_pair = 'admin_added_coin_pair',
}
