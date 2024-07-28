import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.services';
import { PostController } from './post.controllers';
import { Post, PostSchema } from './post.schema';
import { User, UserSchema } from '../user/user.schema'; 
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}