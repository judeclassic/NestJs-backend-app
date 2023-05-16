import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptModule from 'bcryptjs';
import { jwtConstants } from 'src/core/interfaces/constants';
import {
  ErrorInterface,
  Response,
} from 'src/core/interfaces/response/reponses';
import { IAuthenticatedUser } from 'src/core/interfaces/entities/user/user';

@Injectable()
export class EncryptionService {
  private readonly bcrypt: typeof bcryptModule;

  constructor(private readonly jwtService: JwtService) {
    this.bcrypt = bcryptModule;
  }

  public encryptToken = (data: IAuthenticatedUser) => {
    return this.jwtService.sign(data, {
      expiresIn: jwtConstants.expiresIn,
      secret: jwtConstants.secret,
    });
  };

  public verifyBearerToken = (data: string) => {
    if (data === null || data === undefined) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.NOT_MODIFIED,
        errors: [
          { field: 'access_token', message: 'Access token is not provided' },
        ],
      } as Response<ErrorInterface>);
    }
    try {
      const token = data.split(' ', 2)[1];
      const decoded = this.jwtService.verify(
        token,
        jwtConstants.secret as any,
      ) as IAuthenticatedUser;
      return decoded;
    } catch (error) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.NOT_MODIFIED,
        errors: [{ field: 'access_token', message: 'Invalid access token' }],
      } as Response<ErrorInterface>);
    }
  };

  public encryptPasskey = (passkey: any) => {
    return this.bcrypt.hashSync(passkey, 10);
  };

  public comparePasskey = (
    passwordToEncypt: string,
    encryptedPassword: string,
  ) => {
    return this.bcrypt.compareSync(passwordToEncypt, encryptedPassword);
  };

  public generateVerificationCode = (numb: number) => {
    const verificationCode = Math.floor(
      Math.random() * 10 ** numb - 1,
    ).toString();
    return this.addNumberTillEqual(verificationCode);
  };

  private addNumberTillEqual: (num: string) => string = (num: string) => {
    if (num.length < 6) {
      num = '0' + num;
      return this.addNumberTillEqual(num);
    }
    return num;
  };
}
