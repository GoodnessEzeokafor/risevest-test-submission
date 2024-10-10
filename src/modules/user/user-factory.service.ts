import { Injectable } from '@nestjs/common';
import { EncryptionUtilsService } from '../utils';
import { UserEntity } from './entity';
import { IGetUsers } from './type';

@Injectable()
export class UserFactoryServices {
  constructor(private encryption: EncryptionUtilsService) { }

  async clean(data: Partial<UserEntity>) {
    const {
      email,
      firstName,
      lastName,
      fullName,
      username,
      password

    } = data;
    const user = {
      ...(email && { email }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(fullName && { fullName }),
      ...(username && { username }),
      ...(password && { password: await this.encryption.hash(password) }),
    };

    return user;
  }

  cleanUserQuery(data: IGetUsers): Partial<IGetUsers> {
    let key = {};
    if (data.id) key['id'] = data.id;
    if (data.firstName) key['firstName'] = data.firstName;
    if (data.lastName) key['lastName'] = data.lastName;
    if (data.email) key['email'] = data.email;
    if (data.perPage) key['perPage'] = data.perPage;
    if (data.page) key['page'] = data.page;
    if (data.sort) key['sort'] = data.sort;
    if (data.q) key['q'] = data.q;
    return key;
  }
}
