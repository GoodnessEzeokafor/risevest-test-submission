import { Global, Module } from '@nestjs/common';
import { TypeOrmServicesModule } from './typeorm/typeorm-service.module';

@Global()
@Module({
  imports: [TypeOrmServicesModule],
  exports: [TypeOrmServicesModule],
})
export class DatabaseServicesModule { }
