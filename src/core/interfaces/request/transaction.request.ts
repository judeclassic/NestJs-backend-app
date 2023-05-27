import { IsNotEmpty } from 'class-validator';
import { TransactionStatusEnum } from '../entities/transaction/transaction';

export type TRefreshTransactionRequest = {
  transaction_id: string;
  wallet_address: string;
};

export class RefreshTransactionRequestTdo
  implements TRefreshTransactionRequest
{
  @IsNotEmpty()
  transaction_id: string;

  @IsNotEmpty()
  wallet_address: string;
}

export type TViewAllMyTransactionRequest = {
  wallet_address: string;
  page: number;
  limit: number;
};

export class ViewAllMyTransactionRequestDto
  implements TViewAllMyTransactionRequest
{
  @IsNotEmpty()
  wallet_address: string;

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;
}

export type TUpdateTransactionRequest = {
  transaction_id: string;
  amount: number;
  wallet_address: string;
  transaction_status: TransactionStatusEnum;
};

export type TViewAllTransactionRequest = {
  page: number;
  limit: number;
};

export class ViewAllTransactionRequestDto
  implements TViewAllTransactionRequest
{
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;
}
