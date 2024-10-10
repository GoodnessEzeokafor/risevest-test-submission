import { Module } from '@nestjs/common';
import { PostFactoryServices } from './post-factory.service';
import { PostServices } from './post.service';
import { PostController } from './controller';

@Module({
  providers: [PostServices, PostFactoryServices],
  exports: [PostServices],
  controllers: [PostController]
})
export class PostServicesModule { }
