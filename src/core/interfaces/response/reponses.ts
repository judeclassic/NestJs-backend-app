import { HttpStatus } from '@nestjs/common';
import { IAuthenticatedUser } from '../entities/user/user';

export interface ErrorInterface {
  field?: string;
  message: string;
  possibleSolution?: string;
}

export type Response<Data> =
  | {
      statusCode: HttpStatus.OK;
      data: Data;
    }
  | {
      statusCode: Exclude<HttpStatus, HttpStatus.OK>;
      errors: ErrorInterface[];
    };

export type ResponseService<RequestType, ResponseType> = (
  response: RequestType,
) => Promise<Response<ResponseType>>;

export type AuthResponseService<RequestType, ResponseType> = (
  response: RequestType,
  user: IAuthenticatedUser,
) => Promise<Response<ResponseType>>;
