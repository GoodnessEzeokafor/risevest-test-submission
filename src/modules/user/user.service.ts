import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { UserFactoryServices } from './user-factory.service';
import { DataSource } from 'typeorm';
import { IDatabaseServices } from '../database';
import { EncryptionUtilsService, JwtUtilsService, ResponseUtilsService, StringUtilsService, TimeUtilsService } from '../utils';
import { ICreateUser, IGetAuthUser, IGetUsers, ILoginUser } from './type';

@Injectable()
export class UserServices implements OnApplicationShutdown {
  private readonly selectFields = [
    'id',
    'fullName',
    'firstName',
    'lastName',
    'email',
    'username',
    'version',
    'createdAt',
  ]
  constructor(
    private readonly data: IDatabaseServices,
    private readonly userFactory: UserFactoryServices,
    private readonly response: ResponseUtilsService,
    private readonly connection: DataSource,
    private readonly jwt: JwtUtilsService,
    private readonly time: TimeUtilsService,
    private readonly string: StringUtilsService,
    private readonly encryption: EncryptionUtilsService,
  ) { }
  async onApplicationShutdown(signal: string) {
    console.log('signal', signal);
    this.connection.destroy();
  }

  async createUser(payload: ICreateUser) {
    const { email, username, firstName, lastName } = payload;
    const userExists = await this.data.users.findOne([
      { email },
      { username },
    ]);
    if (userExists) {
      return this.response.error409Response(
        'Email or Username already exists',
      );
    }
    const cleanFirstName = this.string.toTitleCase(firstName);
    const cleanLastName = this.string.toTitleCase(lastName);

    const factory = await this.userFactory.clean({
      ...payload,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      fullName: `${cleanFirstName} ${cleanLastName}`,
    });
    const user = await this.data.users.create(factory);

    const jwtPayload = {
      id: user.id,
      email: user.email,
    };
    const oneHr = this.time.convertToSeconds('minute', 60);
    const token = await this.jwt.sign(jwtPayload, oneHr);

    return this.response.success201Response({
      message: 'Created successfully',
      token: `Bearer ${token}`,
      data: {},
    });

  }

  async login(payload: ILoginUser) {
    const { email, password } = payload;
    const user = await this.data.users.findOne({ email });

    if (this.string.isEmpty(user)) {
      return this.response.error400Response('Email or password incorrect');
    }
    if (this.string.isEmpty(user.password)) {
      return this.response.error400Response('Please reset your password');
    }

    const correctPassword: boolean = await this.encryption.compareHash(
      password,
      user?.password,
    );
    if (!correctPassword) {
      return this.response.error400Response('Email or password incorrect');
    }

    const jwtPayload = {
      id: user.id,
      email: user.email,
    };

    const oneHr = this.time.convertToSeconds('minute', 60);
    const token = await this.jwt.sign(jwtPayload, oneHr);

    return this.response.success200Response({
      message: 'Logged in successfully',
      token: `Bearer ${token}`,
      data: {},
    });

  }
  async getUsers(payload: IGetUsers) {
    console.log("===== users payload =====")
    console.log(payload)
    console.log("===== users payload =====")

    const filterQuery = this.userFactory.cleanUserQuery(payload);
    const { data, pagination } = await this.data.users.findAllWithPagination(
      filterQuery,
      { selectFields: this.selectFields },
    );

    return this.response.success200Response({
      message: 'Retrieved successfully',
      data,
      pagination,
    });

  }

  async getAuthUser(payload: IGetAuthUser) {
    return this.response.success200Response({
      message: 'Retrieved successfully',
      data: payload,
    });

  }
}
