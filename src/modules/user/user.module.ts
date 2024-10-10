import { Module } from '@nestjs/common';
import { UserFactoryServices } from './user-factory.service';
import { UserServices } from './user.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards';
import { UserController } from './controller';
import { PostServicesModule } from '../post';

@Module({
  imports: [PostServicesModule],
  providers: [
    UserServices,
    UserFactoryServices,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: [UserServices],
  controllers: [UserController]
})
export class UserServicesModule { }
