import { IsNotEmpty } from 'class-validator';

export type TFundBTCWalletRequest = {
  transaction_id: string;
  amount: number;
};

export class FundBTCWalletRequestDto implements TFundBTCWalletRequest {
  @IsNotEmpty()
  transaction_id: string;

  // @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export type TFundOtherWalletRequest = {
  transaction_id: string;
  amount: number;
  coin_name: string;
  coin_id: string;
};

export class FundOtherWalletRequestDto implements TFundOtherWalletRequest {
  @IsNotEmpty()
  transaction_id: string;

  // @IsNumber()
  // @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  coin_id: string;

  @IsNotEmpty()
  coin_name: string;
}

export type TWithdrawBTCWalletRequest = {
  amount: number;
};

export class WithdrawBTCWalletRequestDto implements TWithdrawBTCWalletRequest {
  // @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export type TWithdrawBRC20WalletRequest = {
  amount: number;
  coin_name: string;
};

export class WithdrawBRC20WalletRequestDto
  implements TWithdrawBRC20WalletRequest
{
  // @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  coin_name: string;
}

export type TCancelWithdrawalRequest = {
  payout_id: string;
};

export type TChangePayoutStatusRequest = {
  payout_id: string;
  payout_status: string;
};

export class CancelWithdrawalRequestDto implements TCancelWithdrawalRequest {
  // @IsNumber()
  @IsNotEmpty()
  payout_id: string;
}
