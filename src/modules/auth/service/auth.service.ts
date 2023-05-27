import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  TCheckIfUserExistRequest,
  TConnectWalletRequest,
} from 'src/core/interfaces/request/auth.request';
import {
  ErrorInterface,
  Response,
  ResponseService,
} from 'src/core/interfaces/response/reponses';
import {
  ICheckUserResponse,
  IUserResponseForEvent,
} from 'src/core/interfaces/response/user.response';
import { UserDTO } from 'src/core/interfaces/entities/user/user.dto';
import { EncryptionService } from 'src/core/services/encryption/encryption.service';
import { UserService } from 'src/core/services/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { UserEventEnum } from 'src/core/interfaces/event';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('USER_KAFKA_CLIENT') private readonly userClient: ClientKafka,
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
  ) {}

  checkIfUserExist: ResponseService<
    TCheckIfUserExistRequest,
    ICheckUserResponse
  > = async ({ wallet_address }) => {
    const foundUser = await this.userService.findOneByWalletAddress(
      wallet_address,
    );

    if (foundUser.statusCode === HttpStatus.OK) {
      return { statusCode: HttpStatus.OK, data: { is_user_existing: true } };
    }
    return { statusCode: HttpStatus.OK, data: { is_user_existing: false } };
  };

  connectWalletAddress: ResponseService<TConnectWalletRequest, UserDTO> =
    async ({ wallet_address, public_key, passkey }) => {
      const foundUserReponse = await this.userService.findOneByWalletAddress(
        wallet_address,
      );

      if (foundUserReponse.statusCode === HttpStatus.OK) {
        const isPasskeyValid = this.encryptionService.comparePasskey(
          passkey,
          foundUserReponse.data.personal.passkey,
        );

        if (!isPasskeyValid) {
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            errors: [{ field: 'passkey', message: 'Invalid passkey' }],
          } as Response<ErrorInterface>);
        }

        foundUserReponse.data.personal.setAccessToken(
          this.encryptionService.encryptToken(
            foundUserReponse.data.toAuthenticatedUser(),
          ),
        );

        return foundUserReponse;
      }

      passkey = this.encryptionService.encryptPasskey(passkey);
      const createdUserResponse = await this.userService.createAccount({
        wallet_address,
        passkey,
        public_key,
      });

      if (createdUserResponse.statusCode !== HttpStatus.OK) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_MODIFIED,
            errors: createdUserResponse.errors,
          } as Response<ErrorInterface>,
          HttpStatus.NOT_MODIFIED,
        );
      }

      createdUserResponse.data.personal.setAccessToken(
        this.encryptionService.encryptToken(
          createdUserResponse.data.toAuthenticatedUser(),
        ),
      );

      this.userClient.emit<IUserResponseForEvent>(
        UserEventEnum.userconnectwallet,
        createdUserResponse.data.toResponseForEvent(),
      );

      return createdUserResponse;
    };
}
